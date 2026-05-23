import React from 'react';

export interface DesktopWindow {
  id: string;
  title: string;
  isOpen: boolean;
  z: number;
  icon?: string;
}

interface SimulatedDesktopProps {
  children: React.ReactNode;
  windows?: Record<string, DesktopWindow>;
  onTaskbarClick?: (id: string) => void;
}

export const SimulatedDesktop: React.FC<SimulatedDesktopProps> = ({ children, windows = {}, onTaskbarClick }) => {
  // Определяем активное окно (с самым высоким Z) для подсветки в таскбаре
  const activeWinId = Object.values(windows)
    .filter(w => w.isOpen)
    .sort((a, b) => b.z - a.z)[0]?.id;

  return (
    <div className="w-full h-[600px] bg-[#0078D7] relative overflow-hidden border-[1px] border-slate-700 shadow-2xl select-none flex flex-col font-sans">
      
      {/* Фон Windows 10 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004275] via-[#0078D7] to-[#005A9E] z-0" />

      {/* Рабочая область */}
      <div className="relative flex-1 overflow-hidden z-10">
        {children}
      </div>

      {/* Панель задач Windows 10 */}
      <div className="h-[40px] bg-black/90 backdrop-blur-md flex items-center z-[1000] border-t border-white/5">
        
        {/* Пуск */}
        <button className="h-full px-4 hover:bg-white/10 transition-colors flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M0 3.449L9.75 2.1v9.451H0V3.449zM0 12.45h9.75v9.451L0 20.551V12.45zM10.55 1.988L24 0v11.55h-13.45V1.988zM10.55 12.45H24v11.551l-13.45-1.988V12.45z" />
          </svg>
        </button>

        {/* Запущенные приложения */}
        <div className="flex h-full items-center ml-1 flex-1 gap-1 overflow-hidden">
          {Object.entries(windows).map(([id, win]) => (
            win.isOpen && (
              <button
                key={id}
                onClick={() => onTaskbarClick?.(id)}
                className={`h-full px-3 min-w-[120px] max-w-[160px] flex items-center gap-2 text-[11px] text-white transition-all border-b-2
                  ${activeWinId === id 
                    ? 'bg-white/15 border-[#0078D7]' 
                    : 'bg-transparent border-transparent hover:bg-white/10'
                  }`}
              >
                <span className="text-sm shrink-0">{win.icon || '📦'}</span>
                <span className="truncate uppercase font-medium tracking-tighter">{win.title}</span>
              </button>
            )
          ))}
        </div>

        {/* Трей */}
        <div className="ml-auto flex items-center h-full px-3 border-l border-white/10 text-white text-[10px] font-light leading-tight">
          <div className="flex flex-col items-end">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="opacity-50">28.05.2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};