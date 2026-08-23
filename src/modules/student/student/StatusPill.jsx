export default function StatusPill({ status, label, icon, className }) {
  return (
    <span className={`status-pill ${className || "status-" + status}`}>
      {icon && <i className={`bi ${icon}`}></i>} {label}
    </span>
  );
}
