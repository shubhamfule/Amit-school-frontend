export default function KpiCard({ icon, iconBg = "#ede9fe", iconColor = "#4d0011", value, label, badge, badgeClass = "badge-blue" }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon" style={{ background: iconBg, color: iconColor }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div className="kpi-val">{value}</div>
        <div className="kpi-label">{label}</div>
        {badge && <span className={`kpi-badge ${badgeClass}`}>{badge}</span>}
      </div>
    </div>
  );
}
