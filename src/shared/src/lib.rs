use serde::{Deserialize, Serialize};

// ── Stats ───────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StatsSnapshot {
	pub total_queries: u64,
	pub blocked_queries: u64,
	pub cache_hits: u64,
	pub avg_latency_ms: f64,
	pub block_rate: f64,
	pub cache_hit_rate: f64,
	pub queries_change: f64,
	pub latency_change: f64,
}

// ── Query Log ───────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueryLogEntry {
	pub domain: String,
	pub qtype: String,
	pub action: String,
	pub latency: String,
	pub time: String,
	pub list: Option<String>,
}

// ── Device ──────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeviceInfo {
	pub name: String,
	pub ip: String,
	pub queries: u64,
	pub blocked: u64,
	pub device_type: String,
	pub status: String,
	pub policy: String,
}

// ── Blocklist ───────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlocklistInfo {
	pub name: String,
	pub domains: u64,
	pub last_updated: String,
	pub enabled: bool,
}

// ── System Status ───────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemStatus {
	pub uptime: String,
	pub memory: String,
	pub cpu: String,
	pub database_size: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpstreamServer {
	pub name: String,
	pub status: String,
	pub latency: String,
}

// ── Chart Data ──────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct QueryChartPoint {
	pub time: String,
	pub allowed: u64,
	pub blocked: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BlockedDomainCount {
	pub domain: String,
	pub count: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HourlyPoint {
	pub hour: u8,
	pub queries: u64,
}

// ── WebSocket Messages ──────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "data")]
pub enum WsMessage {
	#[serde(rename = "query")]
	Query(QueryLogEntry),
	#[serde(rename = "stats")]
	Stats(StatsSnapshot),
}
