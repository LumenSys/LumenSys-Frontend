import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false,
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const hoverClass = hover ? 'hover:shadow-lg transition-shadow' : '';

  return (
    <div className={`bg-white rounded-lg ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  icon,
  className = '',
}) => {
  return (
    <Card className={className} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-textPrimary">{title}</p>
          <p className="text-3xl font-bold text-textPrimary">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full flex items-center justify-center`}>
          {React.isValidElement(icon)
            ? React.cloneElement(icon, {
                ...icon.props,
                className: 'text-white w-7 h-7 ' + (icon.props.className || '')
              })
            : icon}
        </div>
      </div>
    </Card>
  );
};

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  duration?: number | string;
  category?: string;
  company?: string;
  coverage?: string;
  services?: string[];
  iconColor: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  price,
  duration,
  category,
  company,
  coverage,
  services,
  onEdit,
  onDelete,
}) => {
  return (
    <Card hover>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-">{title}</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-900 p-1 rounded"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-900 p-1 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">
            R$ {price.toLocaleString('pt-BR')}
          </span>
          {duration && (
            <span className="text-sm text-gray-500">
              {typeof duration === 'number' ? `${duration}h` : duration}
            </span>
          )}
        </div>
        
        {category && (
          <div className="flex items-center justify-between">
            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
              {category}
            </span>
          </div>
        )}
        
        {services && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Serviços:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              {services.map((service, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {service}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="border-t pt-3 space-y-1">
          {company && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Empresa:</span> {company}
            </p>
          )}
          {coverage && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Cobertura:</span> {coverage}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};