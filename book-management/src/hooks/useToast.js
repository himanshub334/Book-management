import { useState, useCallback, useRef } from 'react';

let idCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 350);
  }, []);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const success = useCallback((msg) => toast(msg, 'success'), [toast]);
  const error   = useCallback((msg) => toast(msg, 'error', 5000), [toast]);
  const info    = useCallback((msg) => toast(msg, 'info'), [toast]);

  return { toasts, toast, success, error, info, dismiss };
}
