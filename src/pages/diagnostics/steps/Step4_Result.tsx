import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { DiagnosticResults } from '../Diagnostics.types';

interface ResultProps {
  results: DiagnosticResults;
}

export const Step4_Result: React.FC<ResultProps> = ({ results }) => {
  const navigate = useNavigate();

  // Логика вердикта
  const getVerdict = () => {
    if (results.mouse.accuracy < 80) return { title: "Начните с мыши", desc: "Вам нужно подтянуть точность клика.", link: "/module/mouse" };
    if (results.keyboard.wpm < 30) return { title: "Курс клавиатуры", desc: "Ваша скорость печати ниже среднего.", link: "/module/keyboard" };
    return { title: "Вы готовы к GUI!", desc: "Отличные результаты по всем фронтам.", link: "/module/gui" };
  };

  const verdict = getVerdict();

  return (
    <div className="max-w-5xl mx-auto p-12 text-center">
      <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter mb-12">Ваш профиль готов</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Карточка Мыши */}
        <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-sm">
          <div className="text-3xl mb-4">🖱️</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Точность мыши</div>
          <div className="text-4xl font-black text-indigo-600">{results.mouse.accuracy}%</div>
        </div>

        {/* Карточка Клавы */}
        <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-sm">
          <div className="text-3xl mb-4">⌨️</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Скорость печати</div>
          <div className="text-4xl font-black text-emerald-600">{results.keyboard.wpm} <span className="text-sm">WPM</span></div>
        </div>

        {/* Карточка GUI */}
        <div className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-sm">
          <div className="text-3xl mb-4">🖥️</div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Реакция в GUI</div>
          <div className="text-4xl font-black text-purple-600">{results.gui.time}с</div>
        </div>
      </div>

      {/* Рекомендация */}
      <div className="bg-indigo-600 rounded-[48px] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 opacity-80">Рекомендация системы:</h3>
          <h4 className="text-4xl font-black uppercase mb-4 tracking-tighter">{verdict.title}</h4>
          <p className="text-indigo-100 font-medium text-lg mb-8">{verdict.desc}</p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate(verdict.link)}
              className="bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
            >
              Перейти к обучению
            </button>
            <button 
              onClick={() => navigate('/modules')}
              className="bg-indigo-500/50 text-white border border-indigo-400/30 px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all"
            >
              В меню модулей
            </button>
          </div>
        </div>
        
        {/* Декор на фоне */}
        <div className="absolute -right-20 -bottom-20 text-[200px] opacity-10 rotate-12 select-none pointer-events-none">
          🎯
        </div>
      </div>
    </div>
  );
};