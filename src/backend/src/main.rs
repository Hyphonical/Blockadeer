use axum::{
	Router,
	extract::ws::{Message, WebSocket, WebSocketUpgrade},
	http::{StatusCode, Uri, header},
	response::{IntoResponse, Json, Response},
	routing::get,
};
use rust_embed::Embed;
use serde_json::json;
use std::net::SocketAddr;
use tokio::time::{Duration, interval};
use tracing_subscriber::{EnvFilter, fmt};

/// Embed the Next.js exported frontend out directory.
/// Build the frontend first with: cd src/frontend && bun install && bun run build
/// The output goes to src/frontend/out/
#[derive(Embed)]
#[folder = "../frontend/out/"]
struct FrontendAssets;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
	// Initialize logging
	fmt()
		.with_env_filter(
			EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")),
		)
		.init();

	let app = Router::new()
		// API routes
		.route("/api/stats", get(api_stats))
		.route("/api/query-log", get(api_query_log))
		.route("/api/devices", get(api_devices))
		.route("/api/blocklists", get(api_blocklists))
		.route("/api/system", get(api_system))
		.route("/api/ws", get(ws_handler))
		// Frontend catch-all (serves embedded React/Next.js app)
		.fallback(get(frontend_handler));

	let addr: SocketAddr = "127.0.0.1:8080".parse()?;
	tracing::info!("Blockadeer server listening on http://{}", addr);

	let listener = tokio::net::TcpListener::bind(addr).await?;
	axum::serve(listener, app).await?;

	Ok(())
}

/// Serve embedded frontend assets, with SPA fallback to index.html
async fn frontend_handler(uri: Uri) -> Response {
	let path = uri.path().trim_start_matches('/');

	// Try to serve the exact file
	if let Some(file) = FrontendAssets::get(path) {
		let mime = mime_guess::from_path(path).first_or_octet_stream();
		(
			StatusCode::OK,
			[(header::CONTENT_TYPE, mime.as_ref())],
			file.data.to_vec(),
		)
			.into_response()
	}
	// SPA fallback: serve index.html for any non-file route
	else if let Some(index) = FrontendAssets::get("index.html") {
		(
			StatusCode::OK,
			[(header::CONTENT_TYPE, "text/html")],
			index.data.to_vec(),
		)
			.into_response()
	} else {
		(
			StatusCode::NOT_FOUND,
			"Frontend not found. Build with: cd src/frontend && bun run build",
		)
			.into_response()
	}
}

/// Mock stats endpoint
async fn api_stats() -> Json<serde_json::Value> {
	Json(json!({
		"total_queries": 1284392,
		"blocked": 342847,
		"cache_hits": 892103,
		"avg_latency_ms": 1.8,
		"block_rate": 26.7,
		"cache_hit_rate": 69.4
	}))
}

/// Mock query log endpoint
async fn api_query_log() -> Json<serde_json::Value> {
	Json(json!({
		"entries": [
			{"domain": "api.spotify.com", "type": "A", "action": "allowed", "latency_ms": 1.2, "time": "2s ago"},
			{"domain": "doubleclick.net", "type": "A", "action": "blocked", "latency_ms": 0.1, "time": "3s ago", "list": "OISD-Full"},
			{"domain": "www.google.com", "type": "AAAA", "action": "cached", "latency_ms": 0.3, "time": "5s ago"},
			{"domain": "analytics.tiktok.com", "type": "A", "action": "blocked", "latency_ms": 0.1, "time": "8s ago", "list": "Hagezi-Normal"},
			{"domain": "cdn.jsdelivr.net", "type": "A", "action": "allowed", "latency_ms": 2.1, "time": "12s ago"}
		]
	}))
}

/// Mock devices endpoint
async fn api_devices() -> Json<serde_json::Value> {
	Json(json!({
		"devices": [
			{"name": "Sarah's iPhone", "ip": "192.168.1.45", "queries": 15234, "blocked": 4201, "status": "active", "policy": "Restricted (Bedtime)"},
			{"name": "Living Room TV", "ip": "192.168.1.102", "queries": 8923, "blocked": 3892, "status": "active", "policy": "Default"},
			{"name": "Work Laptop", "ip": "192.168.1.67", "queries": 12456, "blocked": 2134, "status": "active", "policy": "Custom Rules"},
			{"name": "Desktop PC", "ip": "192.168.1.23", "queries": 6789, "blocked": 1567, "status": "idle", "policy": "Default"},
			{"name": "IoT Hub", "ip": "192.168.1.200", "queries": 2345, "blocked": 1890, "status": "active", "policy": "Strict"}
		]
	}))
}

/// Mock blocklists endpoint
async fn api_blocklists() -> Json<serde_json::Value> {
	Json(json!({
		"blocklists": [
			{"name": "StevenBlack", "domains": 142532, "last_updated": "2 hours ago", "enabled": true},
			{"name": "OISD-Full", "domains": 892341, "last_updated": "2 hours ago", "enabled": true},
			{"name": "Hagezi-Normal", "domains": 234892, "last_updated": "2 hours ago", "enabled": true}
		],
		"total_domains": 1269765
	}))
}

/// Mock system status endpoint
async fn api_system() -> Json<serde_json::Value> {
	Json(json!({
		"uptime": "14d 6h 32m",
		"memory_mb": 48,
		"memory_limit_mb": 100,
		"cpu_percent": 12,
		"database_size_mb": 234,
		"upstream_servers": [
			{"name": "Cloudflare DoH", "status": "primary", "latency_ms": 8},
			{"name": "Quad9 DoH", "status": "secondary", "latency_ms": 12},
			{"name": "1.1.1.1", "status": "fallback", "latency_ms": 4}
		]
	}))
}

/// WebSocket handler for live query stream
async fn ws_handler(ws: WebSocketUpgrade) -> Response {
	ws.on_upgrade(handle_ws)
}

async fn handle_ws(mut socket: WebSocket) {
	let mut tick = interval(Duration::from_secs(2));

	let domains = [
		"api.spotify.com",
		"doubleclick.net",
		"www.google.com",
		"analytics.tiktok.com",
		"cdn.jsdelivr.net",
		"graph.facebook.com",
		"api.github.com",
		"amazon-adsystem.com",
	];
	let actions = ["allowed", "blocked", "cached"];
	let mut i = 0;

	loop {
		tick.tick().await;
		let domain = domains[i % domains.len()];
		let action = actions[i % actions.len()];
		let msg = json!({
			"type": "query",
			"domain": domain,
			"query_type": "A",
			"action": action,
			"latency_ms": 0.1 + (i as f64 * 0.3) % 3.0,
		});

		if socket
			.send(Message::Text(msg.to_string().into()))
			.await
			.is_err()
		{
			break;
		}
		i += 1;
	}
}
