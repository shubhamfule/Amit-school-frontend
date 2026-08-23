export default function FilterChips({ options, active, onChange }) {
  return (
    <div className="filter-chip-row">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`filter-chip ${active === opt.value ? "active" : ""}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
