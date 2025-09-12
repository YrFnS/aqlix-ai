/**
 * Iraqi AI Metric Card Component
 * Reusable metric display card with Arabic/English support
 */

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow' | 'indigo' | 'emerald' | 'cyan';
  isRTL: boolean;
  status?: {
    label: string;
    color: string;
    bgColor: string;
    textColor: string;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  color,
  isRTL,
  status
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100',
    red: 'text-red-600 bg-red-100',
    yellow: 'text-yellow-600 bg-yellow-100',
    indigo: 'text-indigo-600 bg-indigo-100',
    emerald: 'text-emerald-600 bg-emerald-100',
    cyan: 'text-cyan-600 bg-cyan-100'
  };

  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {isPositiveChange && <TrendingUp className="h-4 w-4 text-green-500 mr-1" />}
              {isNegativeChange && <TrendingDown className="h-4 w-4 text-red-500 mr-1" />}
              <span className={`text-sm font-medium ${
                isPositiveChange ? 'text-green-600' : 
                isNegativeChange ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}

          {status && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bgColor} ${status.textColor}`}>
                {status.label}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;