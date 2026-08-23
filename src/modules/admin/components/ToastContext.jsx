import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastCtx = createContext(null);

let idSeq = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const showToast = useCallback((message, icon = 'ti-circle-check') => {
    const id = idSeq++;
    setToasts((t) => [...t, { id, message, icon }]);
    timers.current[id] = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
      delete timers.current[id];
    }, 3200);
  }, []);

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div className="ec-toast show" key={t.id}>
            <i className={`ti ${t.icon}`}></i>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
