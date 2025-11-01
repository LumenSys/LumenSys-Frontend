import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ""
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-hoverButton focus:ring-primary/50 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary text-white hover:bg-hoverButton2 focus:ring-secondary/50 shadow-sm hover:shadow-md',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50',
    ghost: 'text-textPrimary hover:bg-footer focus:ring-primary/30',
    danger: 'bg-danger text-white hover:bg-hoverDanger focus:ring-danger/50 shadow-sm hover:shadow-md'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-3'
  };

  const iconSize = {
    sm: 16,
    md: 18,
    lg: 20
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full border-2 border-current border-t-transparent w-4 h-4" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon size={iconSize[size]} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon size={iconSize[size]} />
          )}
        </>
      )}
    </button>
  );
}