export default function SimplePagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="simple-pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>
        <i className="bi bi-chevron-left"></i>
      </button>
      {pages.map((p) => (
        <button key={p} className={p === page ? "active" : ""} onClick={() => onChange(p)}>
          {p}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => onChange(page + 1)}>
        <i className="bi bi-chevron-right"></i>
      </button>
    </div>
  );
}
