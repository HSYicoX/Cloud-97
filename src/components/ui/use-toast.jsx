// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';

const ToastContext = React.createContext();
export function ToastProvider({
  children
}) {
  const [toasts, setToasts] = React.useState([]);
  const toast = React.useCallback(({
    title,
    description,
    variant = 'default'
  }) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      title,
      description,
      variant
    };
    setToasts(prev => [...prev, newToast]);

    // 自动移除 toast
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
    return id;
  }, []);
  const dismiss = React.useCallback(id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  return <ToastContext.Provider value={{
    toast,
    dismiss
  }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => <div key={toast.id} className={cn("bg-background border rounded-lg p-4 shadow-lg", toast.variant === 'destructive' && "border-destructive bg-destructive/10 text-destructive", toast.variant === 'default' && "border-border")}>
            <h4 className="font-semibold">{toast.title}</h4>
            {toast.description && <p className="text-sm">{toast.description}</p>}
          </div>)}
      </div>
    </ToastContext.Provider>;
}
export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}