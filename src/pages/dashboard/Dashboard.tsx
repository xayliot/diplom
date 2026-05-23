import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SkillMap } from './SkillMap';
import { Statistics } from './Statistics';
import { Achievements } from './Achievements';
import { useUserProgress } from '../../hooks/useUserProgress';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  if (!progress?.diagnosticCompleted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md text-center animate-in fade-in zoom-in duration-500">
          <div className="text-6xl mb-6">🛰️</div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
            Профиль не активирован
          </h2>
          <p className="text-slate-400 mb-8 font-medium leading-relaxed">
            Чтобы увидеть свою карту навыков и начать обучение, необходимо пройти первичную диагностику системы.
          </p>
          <button 
            onClick={() => navigate('/diagnostics')}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
          >
            Запустить диагностику
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Приветствие */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Твой Профиль <span className="text-indigo-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Добро пожаловать обратно. Твои навыки растут!</p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Общий уровень</p>
              <p className="text-xl font-black text-slate-900">{progress?.overallLevel || 1} LVL</p>
            </div>
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">
              {progress?.overallLevel || 1}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Левая колонка */}
          <div className="lg:col-span-8 space-y-8">
            {/* Карта навыков */}
            <section className="bg-white p-6 md:p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                Карта компетенций
              </h2>
              <SkillMap skills={{
                mouse: { level: progress?.completedModules.mouse.accuracy },
                keyboard: { level: progress?.completedModules.keyboard.accuracy },
                gui: { level: progress?.completedModules.gui.accuracy }
                }} />
            </section>
            
            {/* Сетка статистики */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Statistics 
                type="accuracy" 
                value={progress?.overallAccuracy || 0} 
                trend={progress?.accuracyTrend} 
              />
              <Statistics 
                type="speed" 
                value={progress?.typingSpeed || 0} 
                trend={progress?.speedTrend} 
              />
              <Statistics 
                type="score" 
                value={progress?.totalXp || 0} 
              />
              <Statistics 
                type="sessionTime" 
                value={progress?.lastSessionMinutes || 0} 
              />
            </section>
          </div>

          {/* Правая колонка */}
          <div className="lg:col-span-4 space-y-8">
            {/* Достижения */}
            <Achievements items={progress?.achievements || []} />
            
            {/* Кнопка быстрого продолжения */}
            <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Продолжить?</h3>
                <p className="text-indigo-100 text-sm mb-6 opacity-80 leading-relaxed">
                  Ты остановился на модуле 
                  <span className="block font-bold text-white tracking-wide">«{progress?.lastActiveModule || 'Интерфейс'}»</span>
                </p>
                <button 
                  onClick={() => navigate(`/module/${progress?.lastActiveModuleId || 'gui'}`)}
                  className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
                >
                  В бой!
                </button>
              </div>
              
              {/* Декоративная ракета */}
              <div className="absolute -right-6 -bottom-6 text-9xl opacity-10 group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-500 pointer-events-none">
                🚀
              </div>
            </div>
            
            {/* Мини-совет */}
            <div className="p-6 rounded-[32px] bg-slate-100 border border-slate-200/50">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Совет системы</p>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Попробуй улучшить точность в модуле «Мышь», чтобы разблокировать достижение «Снайпер».
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};