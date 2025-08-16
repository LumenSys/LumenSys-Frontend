import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'green' | 'red' | 'purple' | 'yellow' | 'indigo';
    onClick?: () => void;
}

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    bgGradient: string;
    iconBg: string;
}

interface ProgressCardProps {
    title: string;
    current: number;
    target: number;
    unit?: string;
    color?: string;
    icon?: React.ReactNode;
}

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
}

// Card principal de estatísticas
export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    trendDirection = 'neutral',
    color = 'blue',
    onClick
}) => {
    const colorClasses = {
        blue: 'border-blue-200 bg-blue-50',
        green: 'border-green-200 bg-green-50',
        red: 'border-red-200 bg-red-50',
        purple: 'border-purple-200 bg-purple-50',
        yellow: 'border-yellow-200 bg-yellow-50',
        indigo: 'border-indigo-200 bg-indigo-50'
    };

    const iconColors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
        purple: 'text-purple-600',
        yellow: 'text-yellow-600',
        indigo: 'text-indigo-600'
    };

    const trendColors = {
        up: 'text-green-600',
        down: 'text-red-600',
        neutral: 'text-gray-600'
    };

    return (
        <div
            className={`bg-white rounded-xl shadow-sm border-2 ${colorClasses[color]} p-6 hover:shadow-md transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trendColors[trendDirection]}`}>
                                {trendDirection === 'up' && '↗'}
                                {trendDirection === 'down' && '↘'}
                                {trend}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs. mês anterior</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]} ${iconColors[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Card com métricas e gradiente
export const MetricCard: React.FC<MetricCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    bgGradient,
    iconBg
}) => {
    return (
        <div className={`${bgGradient} rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                    {subtitle && (
                        <p className="text-white/70 text-sm mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${iconBg}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

// Card de progresso com barra
export const ProgressCard: React.FC<ProgressCardProps> = ({
    title,
    current,
    target,
    unit = '',
    color = 'blue',
    icon
}) => {
    const percentage = Math.min((current / target) * 100, 100);

    const colorClasses = {
        blue: 'bg-blue-600',
        green: 'bg-green-600',
        red: 'bg-red-600',
        purple: 'bg-purple-600',
        yellow: 'bg-yellow-600',
        indigo: 'bg-indigo-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {icon && (
                    <div className="text-gray-600">
                        {icon}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Progresso:</span>
                    <span className="font-semibold text-gray-900">
                        {percentage.toFixed(0)}%
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${colorClasses[color as keyof typeof colorClasses]}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                    <span>{current.toLocaleString('pt-BR')}{unit}</span>
                    <span>{target.toLocaleString('pt-BR')}{unit}</span>
                </div>
            </div>
        </div>
    );
};

// Card de ação rápida
export const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    description,
    icon,
    color,
    onClick
}) => {
    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 cursor-pointer group"
            onClick={onClick}
        >
            <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${color} text-white group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{description}</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

// Card de resumo com lista
export const SummaryCard: React.FC<{
    title: string;
    icon?: React.ReactNode;
    items: Array<{
        label: string;
        value: string | number;
        color?: string;
    }>;
}> = ({ title, icon, items }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {icon && (
                    <div className="text-gray-600">
                        {icon}
                    </div>
                )}
            </div>

            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{item.label}:</span>
                        <span className={`font-semibold ${item.color || 'text-gray-900'}`}>
                            {item.value}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Card de notificação/alerta
export const AlertCard: React.FC<{
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    icon?: React.ReactNode;
    onClose?: () => void;
}> = ({ title, message, type, icon, onClose }) => {
    const typeStyles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800'
    };

    return (
        <div className={`rounded-xl border-2 p-4 ${typeStyles[type]}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    {icon && (
                        <div className="flex-shrink-0">
                            {icon}
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-sm mt-1 opacity-90">{message}</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-current opacity-60 hover:opacity-100 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default {
    StatCard,
    MetricCard,
    ProgressCard,
    QuickActionCard,
    SummaryCard,
    AlertCard
};