import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'green' | 'purple';
}

const colorClasses = {
  blue: 'border-blue-500 text-blue-500',
  amber: 'border-amber-500 text-amber-500',
  green: 'border-green-500 text-green-500',
  purple: 'border-purple-500 text-purple-500',
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 ${colorClasses[color].split(' ')[0]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>
        <Icon className={`w-12 h-12 opacity-20 ${colorClasses[color].split(' ')[1]}`} />
      </div>
    </div>
  );
};
