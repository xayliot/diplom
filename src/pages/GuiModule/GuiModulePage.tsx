import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GUI_LEVELS } from '../../config/levelConfig';
import { useUserProgress } from '../../hooks/useUserProgress';

export const GuiModulePage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  // КОСТЫЛЬ ДЛЯ РАЗРАБОТКИ
  const DEBUG_MODE = import.meta.env.DEV; 

  const getLevelStatus = (level: any, index: number) => {
    if (DEBUG_MODE) return 'available'; 
    if (!progress) return 'available';
    
    const guiProgress = progress.completedModules?.gui || { currentLevel: 0, completed: false };
    const difficulty = level.difficulty || (index + 1);
    
    if (guiProgress.completed && guiProgress.currentLevel >= difficulty) return 'completed';
    if (difficulty <= (guiProgress.currentLevel || 0) + 1) return 'available';
    
    return 'locked';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* 1. Шапка модуля */}
      <div className="bg-white border-b border-gray-200 p-8 shadow-sm">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/modules')}
            className="text-purple-600 hover:text-purple-800 mb-6 font-bold flex items-center gap-2 transition-transform hover:-translate-x-1 uppercase text-xs tracking-widest"
          >
            ← К модулям
          </button>
          
          {/* Название модуля теперь чисто черное */}
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Модуль C: Интерфейс
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Освойте управление окнами, панелью задач и системным поиском.
          </p>
          
          {progress && (
            <div className="mt-6 bg-purple-50 border border-purple-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <h2 className="font-bold text-purple-800 uppercase text-[10px] tracking-[0.2em] mb-1">Ваш прогресс</h2>
                <p className="text-purple-600 font-black text-xl">
                  Точность: {progress.completedModules?.gui?.accuracy || 0}% | Уровень: {progress.completedModules?.gui?.currentLevel || 0}
                </p>
              </div>
              <div className="text-4xl">🖥️</div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Сетка сценариев */}
      <div className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
        {GUI_LEVELS.map((level: any, index: number) => {
          const status = getLevelStatus(level, index);
          
          return (
            <div
              key={level.id}
              className={`
                bg-white rounded-[40px] shadow-sm overflow-hidden flex flex-col h-full border border-slate-100 transition-all duration-300
                ${status === 'locked' ? 'opacity-60 grayscale' : 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-100/50'}
              `}
            >
              {/* Шапка карточки: Номер и Иконка в одну линию */}
              <div className={`
                h-32 p-8 flex items-center justify-between
                ${status === 'completed' ? 'bg-emerald-500' : status === 'locked' ? 'bg-slate-400' : 'bg-purple-600'}
              `}>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                  {level.difficulty || (index + 1)}
                </div>
                
                {/* Иконка четко справа, без уплывания */}
                <div className="text-6xl filter drop-shadow-lg">
                  {level.icon}
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-slate-900 uppercase mb-3 tracking-tighter leading-tight">
                    {level.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed opacity-80">
                    {level.description}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/module/gui/${level.id}`)}
                  disabled={status === 'locked'}
                  className={`
                    w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all mt-8 
                    ${status === 'locked' 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : status === 'completed'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95'
                        : 'bg-purple-600 text-white shadow-lg shadow-purple-100 hover:bg-purple-700 active:scale-95'
                    }
                  `}
                >
                  {status === 'locked' ? 'Закрыто' : status === 'completed' ? 'Повторить' : 'Начать'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Блок совета */}
      <div className="container mx-auto px-8 pb-12">
        <div className="bg-white border-2 border-purple-100 rounded-[32px] p-6 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">💡</div>
          <div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">Совет дня</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Не бойтесь закрывать лишние окна. Порядок на рабочем столе помогает быстрее находить нужные инструменты.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};