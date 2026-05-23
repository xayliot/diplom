import React, { useState, useEffect } from 'react';
import type { StepProps } from './diagnostics.steps.types';
import type { KeyboardData } from '../Diagnostics.types';

export const Step2_Keyboard: React.FC<StepProps<KeyboardData>> = ({ onComplete }) => {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const targetText = "Быстрая бурая лиса прыгает через ленивого пса.";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) setStartTime(Date.now());
    const value = e.target.value;
    setInput(value);

    if (value === targetText) {
      const endTime = Date.now();
      const seconds = (endTime - (startTime || endTime)) / 1000;
      const wpm = Math.round((targetText.length / 5) / (seconds / 60));
      
      // Простейший расчет точности (для демо)
      onComplete({ wpm, accuracy: 100 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-12 text-center flex flex-col justify-center h-full">
      <div className="mb-10">
        <span className="text-7xl mb-6 block">⌨️</span>
        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">Тест клавиатуры</h2>
        <p className="text-slate-500 font-medium">Введите текст ниже максимально быстро и без ошибок:</p>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border-2 border-slate-100">
        <div className="text-2xl font-mono text-slate-300 mb-6 select-none leading-relaxed">
          {targetText.split('').map((char, i) => (
            <span key={i} className={input[i] === char ? "text-slate-900" : input[i] ? "text-red-500" : ""}>
              {char}
            </span>
          ))}
        </div>
        <input
          autoFocus
          value={input}
          onChange={handleChange}
          className="w-full p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl text-2xl font-mono outline-none focus:border-indigo-500 transition-all"
          placeholder="Начните печатать..."
        />
      </div>
    </div>
  );
};