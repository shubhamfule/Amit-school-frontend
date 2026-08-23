import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, icon, filled = false, size = 'md', footer, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`modal-box ${size === 'lg' ? 'modal-lg' : ''}`}>
        <div className={`modal-head ${filled ? 'filled' : ''}`}>
          <h3>{icon && <i className={`ti ${icon} me-2`} style={{ marginRight: 8 }}></i>}{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <i className="ti ti-x"></i>
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
