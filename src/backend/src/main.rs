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
use rand::SeedableRng;

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

/// WebSocket handler for live dashboard data stream
async fn ws_handler(ws: WebSocketUpgrade) -> Response {
	ws.on_upgrade(handle_ws)
}

async fn handle_ws(mut socket: WebSocket) {
	let mut tick = interval(Duration::from_secs(1));
	let mut rng = rand::rngs::StdRng::from_entropy();

	loop {
		tick.tick().await;

		// Generate random dashboard data
		let stats = generate_stats(&mut rng);
		let query = generate_query(&mut rng);
		let devices = generate_devices(&mut rng);
		let blocklists = generate_blocklists(&mut rng);

		// Send stats update
		if socket
			.send(Message::Text(
				json!({
					"type": "stats",
					"data": stats
				})
				.to_string()
				.into(),
			))
			.await
			.is_err()
		{
			break;
		}

		// Send query log entry
		if socket
			.send(Message::Text(
				json!({
					"type": "query",
					"data": query
				})
				.to_string()
				.into(),
			))
			.await
			.is_err()
		{
			break;
		}

		// Send devices update
		if socket
			.send(Message::Text(
				json!({
					"type": "devices",
					"data": devices
				})
				.to_string()
				.into(),
			))
			.await
			.is_err()
		{
			break;
		}

		// Send blocklists update
		if socket
			.send(Message::Text(
				json!({
					"type": "blocklists",
					"data": blocklists
				})
				.to_string()
				.into(),
			))
			.await
			.is_err()
		{
			break;
		}
	}
}

fn generate_stats(rng: &mut rand::rngs::StdRng) -> serde_json::Value {
	use rand::Rng;
	json!({
		"total_queries": rng.gen_range(1_000_000..2_000_000),
		"blocked": rng.gen_range(300_000..500_000),
		"cache_hits": rng.gen_range(800_000..950_000),
		"avg_latency_ms": rng.gen_range(1.0..5.0),
		"block_rate": rng.gen_range(20.0..35.0),
		"cache_hit_rate": rng.gen_range(60.0..75.0)
	})
}

fn generate_query(rng: &mut rand::rngs::StdRng) -> serde_json::Value {
	use rand::Rng;
	let domains = [
		"api.spotify.com",
		"doubleclick.net",
		"www.google.com",
		"analytics.tiktok.com",
		"cdn.jsdelivr.net",
		"graph.facebook.com",
		"api.github.com",
		"amazon-adsystem.com",
		"tracking.example.com",
		"ads.example.org",
	];
	let actions = ["allowed", "blocked", "cached"];
	let query_types = ["A", "AAAA", "MX", "TXT"];

	json!({
		"domain": domains[rng.gen_range(0..domains.len())],
		"query_type": query_types[rng.gen_range(0..query_types.len())],
		"action": actions[rng.gen_range(0..actions.len())],
		"latency_ms": rng.gen_range(0.1..3.0),
	})
}

fn generate_devices(rng: &mut rand::rngs::StdRng) -> serde_json::Value {
	use rand::Rng;
	let device_names = [
		"Sarah's iPhone",
		"Living Room TV",
		"Work Laptop",
		"Desktop PC",
		"IoT Hub",
	];
	let policies = ["Default", "Restricted (Bedtime)", "Custom Rules", "Strict"];
	let statuses = ["active", "idle"];

	let devices: Vec<_> = device_names
		.iter()
		.map(|name| {
			let queries = rng.gen_range(2_000..20_000);
			let blocked = rng.gen_range(500..queries);
			json!({
				"name": name,
				"ip": format!("192.168.1.{}", rng.gen_range(1..255)),
				"queries": queries,
				"blocked": blocked,
				"status": statuses[rng.gen_range(0..statuses.len())],
				"policy": policies[rng.gen_range(0..policies.len())],
			})
		})
		.collect();

	serde_json::Value::Array(devices)
}

fn generate_blocklists(rng: &mut rand::rngs::StdRng) -> serde_json::Value {
	use rand::Rng;
	let blocklist_names = ["StevenBlack", "OISD-Full", "Hagezi-Normal"];
	let time_phrases = [
		"Just now", "5 minutes ago", "30 minutes ago", "1 hour ago", "2 hours ago",
	];

	let blocklists: Vec<_> = blocklist_names
		.iter()
		.map(|name| {
			json!({
				"name": name,
				"domains": rng.gen_range(100_000..900_000),
				"lastUpdated": time_phrases[rng.gen_range(0..time_phrases.len())],
				"enabled": true,
			})
		})
		.collect();

	serde_json::Value::Array(blocklists)
}
