import { toast, ToastOptions } from 'react-toastify';

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: 'top-center',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
};

// Success notification
export const notifySuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

// Error notification
export const notifyError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

// Info notification
export const notifyInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Warning notification
export const notifyWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

// Loading notification (returns toast ID for updating)
export const notifyLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, { ...defaultOptions, ...options });
};

// Update existing toast (useful for loading states)
export const updateToast = (
  toastId: string | number,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning',
  options?: ToastOptions
) => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    ...defaultOptions,
    ...options,
  });
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Dismiss specific toast
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};