import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContext } from "./ToastContext";

const TOAST_VARIANTS = {
  success: {
    label: "ÉXITO",
    accent: "bg-secondary",
  },
  error: {
    label: "ERROR",
    accent: "bg-primary",
  },
  warning: {
    label: "ADVERTENCIA",
    accent: "bg-primary",
  },
  info: {
    label: "INFO",
    accent: "bg-tertiary",
  },
};

function createToastId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function ToastItem({ toast, onClose }) {
  const variant = TOAST_VARIANTS[toast.type] ?? TOAST_VARIANTS.info;

  return (
    <div
      role={toast.type === "error" ? "alert" : "status"}
      className="pointer-events-auto grid grid-cols-[6px_1fr_auto] border-2 border-secondary bg-neutral text-secondary shadow-[6px_6px_0_0_#1a1c1c]"
    >
      <div className={variant.accent} />

      <div className="px-4 py-3">
        <p className="mb-1 text-xs font-bold uppercase tracking-[1.2px]">
          {toast.title || variant.label}
        </p>

        <p className="text-sm leading-snug text-tertiary">{toast.message}</p>
      </div>

      <button
        type="button"
        onClick={() => onClose(toast.id)}
        className="border-l-2 border-secondary px-3 text-xl leading-none text-secondary hover:bg-secondary hover:text-neutral"
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    const timer = timersRef.current.get(id);

    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    );
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4000 }) => {
      const id = createToastId();

      const newToast = {
        id,
        type,
        title,
        message,
      };

      setToasts((currentToasts) => [...currentToasts, newToast]);

      if (duration !== Infinity) {
        const timer = setTimeout(() => {
          removeToast(id);
        }, duration);

        timersRef.current.set(id, timer);
      }

      return id;
    },
    [removeToast],
  );

  const success = useCallback(
    (message, options = {}) => {
      return showToast({
        type: "success",
        title: "Sesión cerrada",
        message,
        ...options,
      });
    },
    [showToast],
  );

  const error = useCallback(
    (message, options = {}) => {
      return showToast({
        type: "error",
        title: "Error",
        message,
        ...options,
      });
    },
    [showToast],
  );

  const warning = useCallback(
    (message, options = {}) => {
      return showToast({
        type: "warning",
        title: "Atención",
        message,
        ...options,
      });
    },
    [showToast],
  );

  const info = useCallback(
    (message, options = {}) => {
      return showToast({
        type: "info",
        title: "Información",
        message,
        ...options,
      });
    },
    [showToast],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
      success,
      error,
      warning,
      info,
    }),
    [showToast, removeToast, success, error, warning, info],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="fixed right-4 bottom-4 z-9999 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
        aria-live="polite"
        aria-relevant="additions removals"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
