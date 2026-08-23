import React from 'react';

// Reuses the app's existing .stat-card / .stat-icon-wrap / .trend classes
// (see Dashboard.jsx, Students.jsx) so Finance stat cards look native
// instead of introducing a parallel card style.
export default function FinanceStatCard({ icon, value, label, trend, trendDirection = 'up', color = 'purple' }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon-wrap si-${color}`}><i className={`ti ${icon}`}></i></div>
      <div>
        <div className="stat-num">{value}</div>
        <div className="stat-label">{label}</div>
        {trend && (
          <div className={`trend trend-${trendDirection}`}>
            <i className={`ti ti-trending-${trendDirection}`} style={{ fontSize: 12 }}></i>{trend}
          </div>
        )}
      </div>
    </div>
  );
}
