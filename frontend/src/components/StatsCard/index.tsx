import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  description
}: StatsCardProps) {
  const changeColorClasses = {
    positive: 'text-success',
    negative: 'text-danger',
    neutral: 'text-textSecondary'
  };

  return (
    <div className="bg-surface border border-footer rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-textSecondary text-sm font-medium mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-textPrimary mb-1">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </p>
          
          <div className="flex items-center gap-2">
            {change && (
              <span className={`text-sm font-medium ${changeColorClasses[changeType]}`}>
                {change}
              </span>
            )}
            {description && (
              <span className="text-sm text-textSecondary">
                {description}
              </span>
            )}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg bg-primary/10 ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}