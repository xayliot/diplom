import React from 'react';
import { KEYBOARD_ROWS, KEY_MAP } from '../data/keyboard.data.types';

interface VirtualKeyboardProps {
  language: 'ru' | 'en';
  targetKeyCode?: string; // Клавиша, которую нужно нажать
  lastPressedCode?: string; // Последняя нажатая клавиша
  isError?: boolean; // Была ли ошибка при последнем нажатии
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  language,
  targetKeyCode,
  lastPressedCode,
  isError
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-2xl shadow-2xl border-4 border-gray-700 select-none">
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((code) => {
              const keyInfo = KEY_MAP[code];
              const isTarget = targetKeyCode === code;
              const isPressed = lastPressedCode === code;
              
              // Логика цвета
              let bgColor = 'bg-gray-700 text-gray-300';
              if (isTarget) bgColor = 'bg-blue-500 text-white animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]';
              if (isPressed && isError && !isTarget) bgColor = 'bg-red-500 text-white';
              if (isPressed && !isError) bgColor = 'bg-green-500 text-white';

              return (
                <div
                  key={code}
                  className={`
                    ${keyInfo?.width || 'w-12'} h-12 
                    flex items-center justify-center rounded-lg font-bold text-sm
                    transition-all duration-100 border-b-4 border-black/30
                    ${bgColor}
                  `}
                >
                  {keyInfo ? keyInfo[language].toUpperCase() : code.replace('Key', '')}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};