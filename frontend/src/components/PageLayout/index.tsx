import React from 'react';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageLayout({ 
  title, 
  subtitle, 
  children, 
  actions,
  className = ""
}: PageLayoutProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-textSecondary mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex flex-wrap gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Conteúdo da página */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}