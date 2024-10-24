export enum ToastType {
    SUCCESS = 'success',
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
}

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
}
