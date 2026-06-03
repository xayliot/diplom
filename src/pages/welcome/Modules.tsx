import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '../../hooks/useUserProgress';

export const ModulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useUserProgress();

  const getModuleStatus = (moduleId: 'mouse' | 'keyboard' | 'gui') => {
    if (!progress) return 'available';
    
    const moduleProgress = progress.completedModules[moduleId];
    
    if (moduleProgress.completed) {
      return 'completed';
    }
    
    if (moduleId === 'keyboard') {
      const mouseProgress = progress.completedModules.mouse;
      if (mouseProgress.completed || mouseProgress.currentLevel >= 2) {
        return 'available';
      }
      return 'locked';
    }
    
    if (moduleId === 'gui') {
      const keyboardProgress = progress.completedModules.keyboard;
      if (keyboardProgress.completed || keyboardProgress.currentLevel >= 2) {
        return 'available';
      }
      return 'locked';
    }
    
    return 'available';
  };

  const modules = [
    {
      id: 'mouse' as const,
      title: 'Модуль А',
      subtitle: 'Координация «мышь»',
      icon: '🖱️',
      description: 'Научитесь уверенно управлять курсором, точно наводить на цели, кликать и перетаскивать объекты.',
      color: 'from-blue-600 to-blue-400',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      route: '/module/mouse',
      status: getModuleStatus('mouse')
    },
    {
      id: 'keyboard' as const,
      title: 'Модуль Б',
      subtitle: 'Освоение клавиатуры',
      icon: '⌨️',
      description: 'Изучите расположение клавиш, научитесь печатать слова и фразы для эффективной работы.',
      color: 'from-green-600 to-green-400',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      route: '/module/keyboard',
      status: getModuleStatus('keyboard')
    },
    {
      id: 'gui' as const,
      title: 'Модуль В',
      subtitle: 'Работа с GUI',
      icon: '🪟',
      description: 'Освойте работу с окнами, системными меню и другими важными элементами интерфейса.',
      color: 'from-purple-600 to-purple-400',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      route: '/module/gui',
      status: getModuleStatus('gui')
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
            ✅ Пройден
          </span>
        );
      case 'locked':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider">
            🔒 Закрыт
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
            🎯 Доступен
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-blue-600 flex items-center gap-2 transition-colors font-semibold"
          >
            ← Вернуться назад
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 grow">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Программа обучения
          </h1>
          <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Последовательно проходите модули, чтобы освоить компьютер с нуля. 
            Каждый следующий этап открывается после завершения предыдущего.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`
                flex flex-col bg-white rounded-4xl shadow-xl shadow-slate-200/50 overflow-hidden 
                transition-all duration-300 border border-slate-100 relative
                ${mod.status === 'locked' ? 'grayscale-80' : 'hover:-translate-y-2 hover:shadow-2xl'}
              `}
            >
              <div className={`h-3 bg-linear-to-r ${mod.color}`} />
              
              <div className="p-8 flex flex-col grow">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                    {mod.icon}
                  </div>
                  {getStatusBadge(mod.status)}
                </div>

                <div className="grow">
                  <h2 className="text-sm font-black text-blue-600 uppercase tracking-widest mb-1">
                    {mod.title}
                  </h2>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    {mod.subtitle}
                  </h3>
                  <p className="text-slate-500 text-base leading-relaxed line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50">
                  <button
                    onClick={() => navigate(mod.route)}
                    disabled={mod.status === 'locked'}
                    className={`
                      w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all
                      ${mod.status === 'locked'
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : `${mod.buttonColor} text-white shadow-lg active:scale-95`
                      }
                    `}
                  >
                    {mod.status === 'locked'
                      ? 'Нужен доступ'
                      : mod.status === 'completed'
                        ? 'Повторить'
                        : 'Начать'
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {progress && (
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-slate-900 rounded-4xl p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 text-8xl opacity-10 select-none">📊</div>
              <h3 className="text-2xl font-bold mb-6">Ваша статистика</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                <div className="relative">
                  <div className="text-4xl font-black text-blue-400 mb-1">{progress.completedModules.mouse.accuracy || 0}%</div>
                  <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Модуль А</div>
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-green-400 mb-1">{progress.completedModules.keyboard.accuracy || 0}%</div>
                  <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Модуль Б</div>
                </div>
                <div className="relative">
                  <div className="text-4xl font-black text-purple-400 mb-1">{progress.completedModules.gui.accuracy || 0}%</div>
                  <div className="text-slate-400 font-bold uppercase tracking-widest text-xs">Модуль В</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};