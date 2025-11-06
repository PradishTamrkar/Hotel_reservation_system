import React from "react";
import { icons, Loader2 } from "lucide-react";

export const Button = ({
    children,
    variant ='primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    className = '',
    ...props
}) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-dark',
        secondary: 'bg-secondary text-white hover:opacity-90',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        ghost: 'text-primary hover:bg-primary/10',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return(
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
        {loading? (
            <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading...
            </>
        ): (
        <>
        {Icon && <Icon className="w-5 h-5"/>}
        {children}
        </>
        )}
        </button>
    )
}