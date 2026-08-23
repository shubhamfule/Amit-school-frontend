const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function StatCard({ label, value, isCurrency = true }) {
  return (
    <div className="card stat-card">
      <div className="card-body">
        <h3 className="counter">{isCurrency ? inr(value) : value}</h3>
        <p>{label}</p>
      </div>
    </div>
  );
}
