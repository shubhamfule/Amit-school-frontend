export default function PageHeader({ title, subtitle }) {
  return (
    <div className="page-title mb-3" style={{ marginBottom: 18 }}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
