import React, { useState } from 'react';
import type { StepProps } from './diagnostics.steps.types';
import type { GUIData } from '../Diagnostics.types';

export const Step3_GUI: React.FC<StepProps<GUIData>> = ({ onComplete }) => {
  const [timer] = useState(Date.now());

  return (
    <div className="max-w-4xl mx-auto p-12 text-center flex flex-col justify-center h-full">
      <div className="mb-10">
        <span className="text-7xl mb-6 block">🖥️</span>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Тест интерфейса</h2>
        <p className="text-slate-500 font-medium">Найдите и закройте «опасное» окно максимально быстро.</p>
      </div>

      <div className="bg-slate-900 w-full h-[400px] rounded-[40px] relative overflow-hidden border-[10px] border-slate-800 shadow-2xl">
        {/* Имитация окна */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl overflow-hidden animate-bounce">
          <div className="bg-red-500 p-2 flex justify-between items-center px-4">
            <span className="text-[10px] text-white font-bold uppercase">System Error</span>
            <button 
              onClick={() => onComplete({ completed: true, time: ((Date.now() - timer)/1000).toFixed(2) })}
              className="w-5 h-5 bg-white/20 hover:bg-white/40 rounded flex items-center justify-center text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <div className="p-6 text-slate-800 font-bold text-sm">Закрой меня!</div>
        </div>
      </div>
    </div>
  );
};