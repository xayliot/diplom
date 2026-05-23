import React, { useState, useEffect } from 'react';
import { SimulatedWindow, Tooltip } from '../components';
import type { GUIScenarioProps } from '../GUITrainer.types';

type WindowID = 'docs' | 'settings' | 'calc';

interface ExtendedProps extends GUIScenarioProps {
  onSyncWindows?: (windows: any) => void;
  externalFocusId?: string | null; // Новый проп: ID окна, на которое нажали в таскбаре
}

export const Scenario2_WindowControl: React.FC<ExtendedProps> = ({ 
  onComplete, 
  isActive, 
  onSyncWindows,
  externalFocusId 
}) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime] = useState(Date.now());

  const [windows, setWindows] = useState({
    docs: { id: 'docs', title: 'Документы', icon: '📂', isOpen: true, z: 10, isMax: false },
    settings: { id: 'settings', title: 'Настройки', icon: '⚙️', isOpen: true, z: 11, isMax: false },
    calc: { id: 'calc', title: 'Калькулятор', icon: '🔢', isOpen: true, z: 12, isMax: false },
  });

  const steps = [
    "Сверните окно 'Настройки' (кнопка —)",
    "Разверните 'Калькулятор' на весь экран (кнопка ▢)",
    "Выведите 'Документы' на передний план (клик по окну)",
    "Закройте все окна (кнопка ×), чтобы завершить"
  ];

  // 1. Синхронизация ВВЕРХ (в таскбар)
  useEffect(() => {
    onSyncWindows?.(windows);
  }, [windows, onSyncWindows]);

  // 2. Синхронизация ВНИЗ (из таскбара в сценарий)
  useEffect(() => {
    if (externalFocusId && windows[externalFocusId as WindowID]) {
      handleFocus(externalFocusId as WindowID);
    }
  }, [externalFocusId]);

  const updateWin = (id: WindowID, patch: Partial<(typeof windows)['docs']>) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const handleFocus = (id: WindowID) => {
    if (!isActive) return;
    const maxZ = Math.max(...Object.values(windows).map(w => w.z));
    // ОБЯЗАТЕЛЬНО ставим isOpen: true, чтобы "развернуть" окно при клике в таскбаре
    updateWin(id, { z: maxZ + 1, isOpen: true });
    
    if (step === 2 && id === 'docs') setStep(3);
  };

  const handleAction = (id: WindowID, action: 'min' | 'max' | 'close') => {
    if (!isActive) return;

    if (action === 'min') {
      if (step === 0 && id === 'settings') {
        updateWin(id, { isOpen: false });
        setStep(1);
      } else setErrors(e => e + 1);
    } 
    else if (action === 'max') {
      const nextMax = !windows[id].isMax;
      updateWin(id, { isMax: nextMax });
      if (step === 1 && id === 'calc' && nextMax) setStep(2);
    } 
    else if (action === 'close') {
      const nextState = { ...windows, [id]: { ...windows[id], isOpen: false } };
      setWindows(nextState);
      const openCount = Object.values(nextState).filter(w => w.isOpen).length;
      if (step === 3 && openCount === 0) {
        onComplete({
          timeElapsed: (Date.now() - startTime) / 1000,
          accuracy: Math.max(0, 100 - (errors * 5)),
          errors,
          completedSteps: 4
        });
      }
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Tooltip */}
      <div className="absolute top-4 right-4 z-[9999] pointer-events-none w-64">
        <div className="pointer-events-auto shadow-2xl">
          <Tooltip step={step + 1} text={steps[step]} />
        </div>
      </div>

      {/* Иконки на столе */}
      <div className="absolute top-6 left-6 grid grid-cols-1 gap-6 z-10">
        {(Object.entries(windows) as [WindowID, (typeof windows)['docs']][]).map(([id, win]) => (
          <div key={id} className="flex flex-col items-center gap-1 w-16 group cursor-pointer" onClick={() => handleFocus(id)}>
            <div className={`w-12 h-12 flex items-center justify-center text-3xl rounded-sm transition-all ${win.isOpen ? 'bg-white/20 shadow-inner border border-white/30' : 'hover:bg-white/10'}`}>
              {win.icon}
            </div>
            <span className="text-[10px] text-white text-center drop-shadow-md select-none">{win.title}</span>
          </div>
        ))}
      </div>

      {/* Контейнер окон */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {(Object.entries(windows) as [WindowID, (typeof windows)['docs']][]).map(([id, win]) => (
          win.isOpen && (
            <div 
              key={id}
              onMouseDown={() => handleFocus(id)}
              className="absolute transition-all duration-300 pointer-events-auto"
              style={{ 
                zIndex: win.z,
                top: win.isMax ? 0 : (id === 'docs' ? '180px' : id === 'settings' ? '100px' : '40px'),
                left: win.isMax ? 0 : (id === 'docs' ? '120px' : id === 'settings' ? '180px' : '60px'),
                width: win.isMax ? '100%' : '400px',
                height: win.isMax ? '100%' : '280px',
              }}
            >
              <SimulatedWindow
                title={win.title}
                isMaximized={win.isMax}
                onClose={() => handleAction(id, 'close')}
                onMinimize={() => handleAction(id, 'min')}
                onMaximize={() => handleAction(id, 'max')}
              >
                <div className="h-full w-full bg-[#f0f0f0] border-t border-slate-300 flex items-center justify-center">
                  <span className="text-6xl opacity-10 grayscale select-none">{win.icon}</span>
                </div>
              </SimulatedWindow>
            </div>
          )
        ))}
      </div>

      <div className="absolute inset-0 z-0 bg-transparent" onClick={() => isActive && setErrors(e => e + 1)} />
    </div>
  );
};