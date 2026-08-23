// All stat/summary cards across the portal use the project's single maroon
// brand color (--purple: #4d0011) consistently, regardless of the `color`
// prop a page may still pass in — this keeps every call site untouched
// while unifying the look of every stat card.
export default function StatCard({ icon, num, label }) {
  return (
    <div className="col">
      <div className="stat-card">
        <div className="stat-icon-wrap si-purple"><i className={`ti ${icon}`}></i></div>
        <div>
          <div className="stat-num">{num}</div>
          <div className="stat-label">{label}</div>
        </div>
      </div>
    </div>
  );
}
