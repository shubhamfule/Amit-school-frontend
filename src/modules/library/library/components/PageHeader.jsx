export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="d-flex align-items-start justify-content-between flex-wrap gap-3 mb-4">
      <div className="page-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {actions && <div className="page-actions d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
