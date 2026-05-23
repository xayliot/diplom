import React from 'react';
import type { StatCardProps } from './dashboard.components.types';

export const Statistics: React.FC<StatCardProps> = ({ type, value, trend }) => {
  const config = {
    accuracy: {
      label: 'Средняя точность',
      unit: '%',
      icon: '🎯',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    speed: {
      label: 'Скорость печати',
      unit: ' WPM',
      icon: '⚡',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    sessionTime: {
      label: 'Время в системе',
      unit: ' мин',
      icon: '⏱️',
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    score: {
      label: 'Общий счет',
      unit: ' XP',
      icon: '💎',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  };

  const { label, unit, icon, color, bg } = config[type];

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-colors">
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center text-2xl shadow-inner`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-black tracking-tighter ${color}`}>
              {value}
            </span>
            <span className="text-xs font-bold text-slate-400 uppercase">
              {unit}
            </span>
          </div>
        </div>
      </div>

      {trend !== undefined && (
        <div className={`px-3 py-1 rounded-full text-[10px] font-black ${
          trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
};