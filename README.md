# Blockadeer 🛡️ [WIP]

Blockadeer is a high-performance, single-binary, cross-platform DNS ad and tracker blocker written in Rust. It operates as a local DNS resolver and features an embedded Next.js web interface served directly from the same binary.

## Features

* **Multi-Protocol:** Accepts queries over UDP/53, TCP/53, DNS-over-TLS (DoT/853), and DNS-over-HTTPS (DoH/443).
* **High Performance Engine:** Utilizes a hybrid filtering approach combining a Bloom filter for fast-path rejection and a Finite State Transducer (FST) for exact matching, layered with wildcard support.
* **Single Binary Deployment:** The Next.js React frontend is exported as a highly-optimized static site and embedded via `rust-embed` into the compiled Axum server. No separate web server required.
* **Cross-Platform:** Native targets for Windows, macOS (Intel & Apple Silicon), and Linux. Optimized for SBCs like the Raspberry Pi 5.
* **Persistent Storage:** All query logs, rules, analytics snapshots, and schedules are stored locally in a SQLite database.

## Architecture

* **`src/frontend`**: A Next.js application configured for static HTML export (`output: 'export'`).
* **`src/backend`**: The Rust core application, utilizing Tokio runtimes, Axum for the REST/WebSocket API and asset serving, and strict memory limits.
* **`src/shared`**: Common types and constants utilized across the workspace.

## Building and Running Locally

To build Blockadeer, ensure you have [Rust](https://rustup.rs/) and [Bun](https://bun.sh/) installed.

1. **Build the web interface:**
   ```bash
   cd src/frontend
   bun install
   bun run build
   ```

2. **Run the native backend:**
   ```bash
   cd ../backend
   cargo run --release
   ```

3. Navigate to `http://127.0.0.1:8080` in your browser to view the application metrics, dashboards, and settings.
