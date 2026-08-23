import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, msg: '', icon: 'ti-check' });
  const timerRef = useRef(null);

  const showToast = useCallback((msg, icon = 'ti-check') => {
    clearTimeout(timerRef.current);
    setToast({ show: true, msg, icon });
    timerRef.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className={`ec-toast${toast.show ? ' show' : ''}`}>
        <i className={`ti ${toast.icon}`}></i>
        <span>{toast.msg}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
