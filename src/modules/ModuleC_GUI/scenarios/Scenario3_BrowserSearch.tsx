import React, { useState, useEffect } from 'react';
import { SimulatedWindow, Tooltip } from '../components';
import type { GUIScenarioProps } from '../GUITrainer.types';

interface ExtendedProps extends GUIScenarioProps {
  onSyncWindows?: (windows: any) => void;
  externalFocusId?: string | null;
}

export const Scenario3_BrowserSearch: React.FC<ExtendedProps> = ({ 
  onComplete, 
  isActive, 
  onSyncWindows,
  externalFocusId 
}) => {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime] = useState(Date.now());

  // Состояние окна браузера для таскбара
  const [windows, setWindows] = useState({
    browser: { id: 'browser', title: 'Web Browser', icon: '🌐', isOpen: true, z: 10, isMax: false }
  });

  const steps = [
    "Введите адрес 'google.com' в адресную строку",
    "Нажмите Enter для перехода",
    "Введите 'как научиться печатать' в строку поиска",
    "Нажмите на иконку поиска (Лупа)"
  ];

  // Синхронизация с таскбаром
  useEffect(() => {
    onSyncWindows?.(windows);
  }, [windows, onSyncWindows]);

  // Реакция на клик по таскбару
  useEffect(() => {
    if (externalFocusId === 'browser') {
      const maxZ = Math.max(...Object.values(windows).map(w => w.z));
      setWindows(prev => ({ 
        ...prev, 
        browser: { ...prev.browser, z: maxZ + 1, isOpen: true } 
      }));
    }
  }, [externalFocusId]);

  const checkUrl = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (url.toLowerCase().trim() === 'google.com') {
        setStep(2);
      } else {
        setErrors(prev => prev + 1);
      }
    }
  };

  const handleFinish = () => {
    if (step === 3) {
      onComplete({
        timeElapsed: (Date.now() - startTime) / 1000,
        accuracy: Math.max(0, 100 - (errors * 10)),
        errors,
        completedSteps: 4
      });
    }
  };

  if (!windows.browser.isOpen) return null;

  return (
    <div className="w-full h-full relative">
      {/* Подсказка в углу */}
      <div className="absolute top-4 right-4 z-[9999] pointer-events-none w-64">
        <div className="pointer-events-auto shadow-2xl">
          <Tooltip step={step + 1} text={steps[step]} />
        </div>
      </div>

      {/* Окно браузера */}
      <div 
        className="absolute shadow-2xl transition-all duration-300"
        style={{ 
          zIndex: windows.browser.z,
          top: '40px',
          left: '60px',
          width: '800px',
          height: '500px'
        }}
      >
        <SimulatedWindow 
          title="Web Browser" 
          onClose={() => setWindows(prev => ({ ...prev, browser: { ...prev.browser, isOpen: false }}))}
          onMinimize={() => setWindows(prev => ({ ...prev, browser: { ...prev.browser, isOpen: false }}))}
        >
          <div className="flex flex-col h-full bg-white select-text">
            {/* Панель адреса */}
            <div className="p-2 bg-slate-100 flex items-center gap-3 border-b border-slate-200">
              <div className="flex gap-2 px-2">
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-300" />
              </div>
              <div className="flex-1 relative">
                <input 
                  className={`w-full px-4 py-1.5 rounded bg-white border text-sm outline-none transition-all
                    ${step === 0 ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm' : 'border-slate-300 text-slate-600'}`}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (step === 0 && e.target.value.toLowerCase() === 'google.com') setStep(1);
                  }}
                  onKeyDown={checkUrl}
                  placeholder="Введите URL (например, google.com)..."
                  disabled={step >= 2}
                />
              </div>
            </div>

            {/* Контент */}
            <div className="flex-1 flex flex-col items-center justify-center p-10 bg-white">
              {step < 2 ? (
                <div className="flex flex-col items-center opacity-20">
                  <div className="text-8xl mb-4">🌐</div>
                  <div className="text-gray-400 font-black text-2xl uppercase tracking-tighter">Пустая страница</div>
                </div>
              ) : (
                <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  <div className="text-6xl font-black text-center select-none tracking-tighter">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </div>
                  
                  <div className="relative group">
                    <input 
                      autoFocus
                      className={`w-full border-2 px-6 py-4 rounded-full shadow-lg outline-none transition-all text-lg
                        ${step === 2 ? 'border-blue-400 ring-4 ring-blue-50' : 'border-slate-100'}`}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (step === 2 && e.target.value.toLowerCase().includes('как научиться печатать')) {
                          setStep(3);
                        }
                      }}
                      placeholder="Поиск в Google или введите URL"
                    />
                    <button 
                      onClick={handleFinish}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full transition-all
                        ${step === 3 
                          ? 'bg-blue-600 text-white shadow-xl hover:scale-110 cursor-pointer' 
                          : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                      <span className="text-xl">🔍</span>
                    </button>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded text-sm text-slate-500">Поиск в Google</div>
                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded text-sm text-slate-500">Мне повезёт!</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SimulatedWindow>
      </div>

      {/* Фон для ошибок */}
      <div 
        className="absolute inset-0 z-0" 
        onClick={() => isActive && setErrors(prev => prev + 1)} 
      />
    </div>
  );
};