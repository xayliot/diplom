import React from 'react';

interface SimulatedWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void; // Добавили сворачивание
  onMaximize?: () => void; // Добавили развертывание
  width?: string;
  height?: string;
  isMaximized?: boolean;   // Чтобы менять иконку кнопки развертывания
}

export const SimulatedWindow: React.FC<SimulatedWindowProps> = ({ 
  title, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  width = "600px", 
  height = "400px",
  isMaximized = false
}) => {
  return (
    <div 
      className={`bg-white shadow-2xl border border-gray-300 overflow-hidden flex flex-col transition-all duration-300 ${isMaximized ? 'rounded-none' : 'rounded-xl'}`}
      style={{ width: isMaximized ? '100%' : width, height: isMaximized ? '100%' : height }}
    >
      {/* Заголовок окна (Title Bar) */}
      <div className="bg-gray-100 h-9 flex justify-between items-center border-b border-gray-200 select-none">
        {/* Левая часть: Иконка и название */}
        <div className="flex items-center px-3 gap-2 truncate">
          <div className="w-4 h-4 bg-blue-500 rounded-sm flex-shrink-0" /> {/* Имитация иконки приложения */}
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider truncate">
            {title}
          </span>
        </div>
        
        {/* Правая часть: Кнопки управления (Windows Style) */}
        <div className="flex h-full items-center">
          {onMinimize && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMinimize(); }}
              className="w-10 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"
              title="Свернуть"
            >
              <span className="mb-1 text-lg">—</span>
            </button>
          )}
          
          {onMaximize && (
            <button 
              onClick={(e) => { e.stopPropagation(); onMaximize(); }}
              className="w-10 h-full flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"
              title={isMaximized ? "Восстановить" : "Развернуть"}
            >
              <span className="text-sm">{isMaximized ? '❐' : '▢'}</span>
            </button>
          )}
          
          {onClose && (
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="w-12 h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-gray-500 text-xl"
              title="Закрыть"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {/* Контент окна */}
      <div className="flex-1 relative bg-white overflow-auto">
        {children}
      </div>
    </div>
  );
};