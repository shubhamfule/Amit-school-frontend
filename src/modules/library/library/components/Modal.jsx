export default function Modal({ open, onClose, title, icon, size, footer, children }) {
  if (!open) return null;
  return (
    <div className="ec-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`ec-modal${size === 'sm' ? ' sm' : ''}`}>
        <div className="modal-header">
          <h5 className="modal-title">
            {icon && <i className={`ti ${icon} me-2`} style={{ color: 'var(--purple)' }}></i>}
            {title}
          </h5>
          <button type="button" className="btn-close" onClick={onClose}></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
