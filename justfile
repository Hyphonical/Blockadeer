# Blockadeer build orchestration
# Install `just` via: cargo install just

# Use PowerShell on Windows, sh on Unix
set windows-shell := ["pwsh.exe", "-NoLogo", "-Command"]
set shell := ["bash", "-uc"]

# Default recipe - build everything
default: build

# Build everything (frontend + backend)
build:
    cd src/frontend && bun install && bun run build && cd ../..
    cargo build --release

# Build only the frontend
build-frontend:
    cd src/frontend && bun install && bun run build

# Build only the backend (requires frontend to already be built)
build-backend:
    cargo build --release

# Clean all build artifacts
clean:
    cd src/frontend && bun run clean 2>/dev/null || true
    cargo clean
    rm -rf src/frontend/out

# Run cargo check (fast, no binary output)
check:
    cargo check

# Run clippy linter
lint:
    cargo clippy --all-targets --all-features

# Format code
fmt:
    cargo fmt

# Run tests
test:
    cargo test

# Release build with all optimizations
release:
    cargo build --release --locked

# Build for a specific target
build-target TARGET:
    cd src/frontend && bun install && bun run build && cd ../..
    cargo build --release --target {{TARGET}}
