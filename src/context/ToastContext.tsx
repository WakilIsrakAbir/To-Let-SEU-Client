'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface IToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  toast: {
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
  };
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<IToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, duration: number = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const toast = {
    success: useCallback((msg: string, dur?: number) => addToast('success', msg, dur), [addToast]),
    error: useCallback((msg: string, dur?: number) => addToast('error', msg, dur), [addToast]),
    info: useCallback((msg: string, dur?: number) => addToast('info', msg, dur), [addToast]),
    warning: useCallback((msg: string, dur?: number) => addToast('warning', msg, dur), [addToast]),
  };

  const getToastStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-600 dark:bg-emerald-600',
          border: 'border-emerald-500',
          icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-600 dark:bg-rose-600',
          border: 'border-rose-500',
          icon: <AlertCircle className="w-5 h-5 shrink-0 text-white" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-600 dark:bg-amber-600',
          border: 'border-amber-500',
          icon: <AlertTriangle className="w-5 h-5 shrink-0 text-white" />,
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-600 dark:bg-indigo-600',
          border: 'border-indigo-500',
          icon: <Info className="w-5 h-5 shrink-0 text-white" />,
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => {
            const style = getToastStyle(t.type);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`pointer-events-auto rounded-2xl p-4 shadow-2xl text-white border flex items-center justify-between gap-3 backdrop-blur-xs ${style.bg} ${style.border}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {style.icon}
                  <span className="text-xs sm:text-sm font-semibold leading-snug break-words">
                    {t.message}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeToast(t.id)}
                  className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-black/15 transition shrink-0"
                  title="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
