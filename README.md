# Blockadeer 🛡️

**Single-binary DNS ad and tracker blocker. No logs. No cloud. No config headaches.**

Blockadeer is a local DNS resolver that blocks ads and trackers at the network level. Point your devices at it and anything resolving to known ad/tracker domains gets NXDOMAIN'd. Everything runs locally—queries never leave your network. A slick Next.js dashboard gives you live query logs, device management, and per-device filtering policies. All in one binary you can drop on a Raspberry Pi and forget about.

## Table of Contents

- [What's This About?](#whats-this-about)
- [Why?](#why)
- [Features](#features-)
- [Quick Start](#quick-start-)
- [Documentation](#documentation-)
- [Architecture](#architecture)
- [Building](#building)
- [Contributing](#contributing)
- [License](#license)

## What's This About?

You want to block ads network-wide without setting up a VPN, flashing custom firmware, or paying for a subscription. You want something that Just Works on a Raspberry Pi sitting in your closet, doesn't phone home, and gives you a nice dashboard to see what's happening.

Blockadeer speaks DNS—UDP, TCP, DNS-over-TLS, and DNS-over-HTTPS. Point your router or devices at it and it resolves names upstream while silently dropping queries to the ad/tracker blocklists you've configured. The dashboard shows live queries, device-level stats, and lets you create custom rules, schedules, and policies per device.

Uses a hybrid Bloom filter + Finite State Transducer (FST) engine for fast domain matching with wildcard suffix support. All data lives in a local SQLite database—no external dependencies at runtime.

## Why?

Because you shouldn't need a PhD in networking to block ads at the network level. Pi-hole works but feels like 2015. AdGuard Home is fine but is Go, requires a separate binary for the DNS server, and the UI is... a thing.

Blockadeer is a single Rust binary with an embedded Next.js dashboard. `cargo build --release` gives you one file. Move it to your Pi, run it. That's the whole deployment story.

Also: Rust is cool, Moka caches are neat, and embedding a static Next.js app into a binary using `rust-embed` felt like a fun problem to solve.

## Features 🎯

- **🌐 Full DNS resolver** — UDP/53, TCP/53, DNS-over-TLS (DoT/853), DNS-over-HTTPS (DoH/443)
- **⚡ Hybrid filtering** — Bloom filter for fast rejection, FST for exact matching, wildcard suffix support
- **📊 Live dashboard** — Next.js UI served directly from the binary, WebSocket-powered live query stream
- **👤 Per-device policies** — Assign filtering rules, schedules, and blocklists to specific devices
- **📋 Custom rules** — Add your own domains to block or allow via SQLite-backed rules
- **📅 Schedules** — Time-based filtering (e.g., "no adult content after 10pm")
- **🔄 Blocklist management** — Enable/disable blocklists, automatic refresh
- **🗄️ SQLite persistence** — Query logs, device registry, custom rules, analytics snapshots
- **📈 Query analytics** — Block rates, cache hit rates, latency histograms
- **🔒 Privacy-first** — No telemetry, no cloud dependency, all local
- **🍎 Cross-platform** — Runs on Linux, macOS, Windows, and ARM (Raspberry Pi)
- **📦 Single binary** — Next.js frontend embedded via `rust-embed`, no separate web server needed

## Quick Start 🚀

### 1. Install

Requires Rust **1.88** or later and [Bun](https://bun.sh).

```bash
git clone https://github.com/Hyphonical/Blockadeer.git
cd Blockadeer
just build
```

Binary at `target/release/blockadeer` (or `blockadeer.exe` on Windows).

### 2. Run

```bash
# Start the DNS server + dashboard (defaults: UDP/53, TCP/53, HTTP on 8080)
sudo ./target/release/blockadeer

# With custom config
./target/release/blockadeer --config /path/to/config.toml

# Or via environment variables
BLOCKADEER_DATA_DIR=/var/lib/blockadeer ./target/release/blockadeer
```

### 3. Configure Your Network

Point your router's DHCP DNS settings to the machine running Blockadeer. Or set individual devices to use Blockadeer as their DNS server.

Dashboard available at `http://localhost:8080` by default.

## Documentation 📚

| Doc | Purpose |
|-----|---------|
| [PLAN.md](.other/PLAN.md) | Technical specification, architecture, design decisions |
| [docs/](./docs/) | Detailed documentation (work in progress) |

---

## Architecture

```
                    ┌──────────────────────────────────────┐
                    │           Blockadeer Binary          │
                    │                                      │
┌──────────────┐    │   ┌─────────────┐   ┌──────────────┐ │
│   Devices    │───────▶│   DNS       │   │   REST API   │ │
│              │    │   │   Server    │   │   + WS       │ │
└──────────────┘    │   │  UDP/TCP    │   │   (Axum)     │ │
                    │   │  DoT/DoH    │   │              │ │
                    │   └─────┬───────┘   └──────┬───────┘ │
                    │         │                  │         │
                    │         ▼                  ▼         │
                    │  ┌─────────────┐   ┌──────────────┐  │
                    │  │   Filter    │   │   Next.js    │  │
                    │  │   Engine    │   │   Dashboard  │  │
                    │  │ Bloom + FST │   │   (static)   │  │
                    │  └──────┬──────┘   └──────────────┘  │
                    │         │                            │
                    │         ▼                            │
                    │  ┌─────────────┐                     │
                    │  │   Cache     │                     │
                    │  │   (Moka)    │                     │
                    │  └──────┬──────┘                     │
                    │         │                            │
                    │         ▼                            │
                    │  ┌─────────────┐                     │
                    │  │  Upstream   │                     │
                    │  │  Resolvers  │                     │
                    │  └─────────────┘                     │
                    │         │                            │
                    │         ▼                            │
                    │  ┌─────────────┐                     │
                    │  │  SQLite     │                     │
                    │  │  Database   │                     │
                    │  └─────────────┘                     │
                    └──────────────────────────────────────┘
```

### Request Flow

```
Incoming DNS Query (UDP/TCP/DoT/DoH)
              │
              ▼
    ┌─────────────────┐
    │  Parse wire     │  ← hickory-proto
    │  format         │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │  Check cache    │  ← Moka with TTL
    │  (domain + qtype)│
    └────────┬────────┘
             │
       Cache │  Miss
       Hit   │  ──────▶
        │    │              ┌─────────────────┐
        ▼    │              │  1. Bloom check │
   Return    │              │  2. FST lookup  │  ← fast reject
   cached    │              │  3. Wildcard    │
   response  │              │  4. Custom rules│
             │              │  5. Schedules   │
             │              └────────┬────────┘
             │                       │
             │            Blocked ◀──┼─── Allowed
             │               │       │
             │               ▼       ▼
             │           NXDOMAIN   Upstream resolvers
             │                          │
             │           ┌──────────────┘
             │           │
             │           ▼
             │    ┌─────────────┐
             │    │  Insert     │
             │    │  to cache   │
             │    └─────────────┘
             │
             ▼
        Return response
```

### Technology Stack

| Component | Crate | Rationale |
|-----------|-------|-----------|
| Async runtime | `tokio 1` | Multi-threaded, `SO_REUSEPORT` support |
| DNS protocol | `hickory-proto 0.25` | Wire format, EDNS0, DNSSEC parsing |
| HTTP server | `axum 0.8` | Tokio-native, Tower middleware, WebSocket |
| TLS | `rustls 0.23` | Pure Rust TLS 1.2/1.3, no OpenSSL |
| Database ORM | `sea-orm 1` | Async SQLite, migrations |
| DNS cache | `moka 0.12` | Concurrent cache with per-entry TTL |
| FST | `fst 0.4` | Memory-efficient compressed trie |
| Bloom filter | `bloomfilter 1` | Probabilistic pre-filter |
| Web UI | `next 16` (React) | Static export, embedded in binary |
| Asset embedding | `rust-embed 8` | Compile-time embedding of `out/` |

---

## Building

### Prerequisites

- **Rust 1.88+** — Install via [rustup](https://rustup.rs/)
- **Bun** — Required for building the frontend. Install via:
  ```powershell
  # Windows (PowerShell)
  irm bun.sh/install.ps1 | iex
  ```
- **just** — Command runner for the build process. Install via:
  ```powershell
  # Windows (PowerShell) - recommended
  winget install --id Casey.Just --exact
  
  # Or via cargo
  cargo install just
  
  # Or via scoop
  scoop install just
  ```

### Build Steps

```bash
# Clone and build everything in one command
git clone https://github.com/Hyphonical/Blockadeer.git
cd Blockadeer
just build
```

The final binary is at `target/release/blockadeer` (or `blockadeer.exe` on Windows).

### Build Output

| File | Description |
|------|-------------|
| `target/release/blockadeer` | Final binary with embedded frontend |
| `src/frontend/out/` | Next.js static export (embedded into binary) |

### The `justfile`

Blockadeer uses a `justfile` to orchestrate the build. You can also run individual tasks:

```bash
just              # Build everything (default)
just build        # Same as above
just build-frontend  # Build only the frontend
just build-backend   # Build only the backend
just clean        # Clean build artifacts
just check        # Run cargo check (no binary output)
just lint         # Run cargo clippy
```

### Cross-Compilation

```bash
# ARMv7 (Raspberry Pi 3/4)
rustup target add armv7-unknown-linux-gnueabihf
just build --target armv7-unknown-linux-gnueabihf

# ARM64 (Raspberry Pi 5, Apple Silicon)
rustup target add aarch64-unknown-linux-gnu
just build --target aarch64-unknown-linux-gnu
```

---

## Configuration

Blockadeer uses a layered configuration system:

1. **Config file** (`config.toml`) — Base settings
2. **Environment variables** — Override any config value

### Example `config.toml`

```toml
[data_dir]
path = "/var/lib/blockadeer"

[network]
bind_address = "0.0.0.0"
dns_port = 53
http_port = 8080

[upstream]
# DNS resolvers to use (in order of preference)
# Supported: DoH, DoT, plain UDP
servers = [
    "https://cloudflare-dns.com/dns-query",
    "https://dns.quad9.net/dns-query",
]

[filter]
# Default blocklist URLs (one per line)
blocklists = [
    "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
]

[cache]
# Cache TTL in seconds (0 = use upstream TTL)
default_ttl = 3600
max_size_mb = 100
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BLOCKADEER_DATA_DIR` | Data directory path | Platform-specific |
| `BLOCKADEER_CONFIG` | Config file path | `config.toml` in data dir |
| `RUST_LOG` | Log level | `info` |

---

## REST API

The embedded dashboard uses these API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stats` | GET | Query statistics |
| `/api/query-log` | GET | Recent query log entries |
| `/api/devices` | GET | Registered devices |
| `/api/blocklists` | GET | Blocklist status |
| `/api/system` | GET | System status |
| `/api/ws` | WS | WebSocket for live updates |

---

## Contributing

PRs welcome. Please run `cargo fmt` and `cargo clippy` before submitting. Follow Rust idioms and the existing code style.

```bash
# Format code
cargo fmt

# Lint
cargo clippy

# Run tests
cargo test
```

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

Made with ☕ and Rust. DNS has never been this blocking.
