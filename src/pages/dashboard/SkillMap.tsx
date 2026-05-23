import React from 'react';

export const SkillMap: React.FC<{ skills: any }> = ({ skills }) => {
  const categories = [
    { id: 'mouse', label: 'Владение мышью', color: 'bg-blue-500', icon: '🖱️' },
    { id: 'keyboard', label: 'Скорость печати', color: 'bg-emerald-500', icon: '⌨️' },
    { id: 'gui', label: 'Работа в ОС', color: 'bg-purple-500', icon: '🖥️' },
  ];

  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="flex justify-between items-end mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-bold text-slate-800 uppercase text-sm tracking-tight">{cat.label}</span>
            </div>
            <span className="font-black text-slate-900">{skills?.[cat.id]?.level || 0}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
            <div 
              className={`h-full ${cat.color} transition-all duration-1000 shadow-lg`} 
              style={{ width: `${skills?.[cat.id]?.level || 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};