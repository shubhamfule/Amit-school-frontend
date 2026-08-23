export default function KpiCard({ icon, label, value, trend, trendDirection = "up", color, bg }) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-icon" style={{ background: bg, color }}>
          <i className={icon}></i>
        </div>
        {trend && (
          <span className={`kpi-trend ${trendDirection}`}>
            <i className={`bi ${trendDirection === "up" ? "bi-arrow-up-short" : "bi-arrow-down-short"}`}></i>
            {trend}
          </span>
        )}
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
    </div>
  );
}
