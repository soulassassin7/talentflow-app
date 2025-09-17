import React from 'react';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface FeedbackPopupProps {
    message: string;
    show: boolean;
    type?: 'success' | 'error' | 'info' | 'warning';
}

const FeedbackPopup: React.FC<FeedbackPopupProps> = ({ message, show, type = 'success' }) => {
    if (!show) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircleIcon className="h-5 w-5" />;
            case 'error':
                return <XCircleIcon className="h-5 w-5" />;
            case 'warning':
                return <ExclamationTriangleIcon className="h-5 w-5" />;
            case 'info':
                return <InformationCircleIcon className="h-5 w-5" />;
            default:
                return <CheckCircleIcon className="h-5 w-5" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-emerald-500/20',
                    border: 'border-emerald-500/50',
                    text: 'text-emerald-400',
                    icon: 'text-emerald-400'
                };
            case 'error':
                return {
                    bg: 'bg-red-500/20',
                    border: 'border-red-500/50',
                    text: 'text-red-400',
                    icon: 'text-red-400'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-500/20',
                    border: 'border-amber-500/50',
                    text: 'text-amber-400',
                    icon: 'text-amber-400'
                };
            case 'info':
                return {
                    bg: 'bg-blue-500/20',
                    border: 'border-blue-500/50',
                    text: 'text-blue-400',
                    icon: 'text-blue-400'
                };
            default:
                return {
                    bg: 'bg-emerald-500/20',
                    border: 'border-emerald-500/50',
                    text: 'text-emerald-400',
                    icon: 'text-emerald-400'
                };
        }
    };

    const styles = getStyles();

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
            <div className={`
                flex items-center gap-3 px-5 py-3 rounded-lg
                ${styles.bg} ${styles.border} border
                backdrop-blur-xl shadow-2xl
                transform transition-all duration-300
            `}>
                <div className={styles.icon}>
                    {getIcon()}
                </div>
                <span className={`font-medium text-sm ${styles.text}`}>
                    {message}
                </span>
            </div>
        </div>
    );
};

export default FeedbackPopup;