import React, { useState, useEffect, useCallback } from 'react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { PHRASES_LIST } from '../data/phrases';
import { KEY_MAP, FINGER_ZONES, FINGER_NAMES } from '../data/keyboard.data.types';
import type { KeyboardLevelProps } from './keyboardLevels.types';

export const Level4_TenFingers: React.FC<KeyboardLevelProps> = ({
  language,
  onComplete,
  isActive
}) => {
  const [phrase, setPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [lastEvent, setLastEvent] = useState({ code: '', isError: false });

  useEffect(() => {
    if (isActive) {
      const list = PHRASES_LIST[language];
      setPhrase(list[Math.floor(Math.random() * list.length)]);
      setUserInput("");
      setErrors(0);
      setStartTime(null);
    }
  }, [isActive, language]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || !phrase || userInput.length >= phrase.length) return;
    if (e.code === 'Space') e.preventDefault();

    const targetChar = phrase[userInput.length];
    const isCorrect = e.key === targetChar;

    setLastEvent({ code: e.code, isError: !isCorrect });

    if (isCorrect) {
      if (!startTime) setStartTime(Date.now());
      const newInput = userInput + e.key;
      setUserInput(newInput);

      if (newInput.length === phrase.length) {
        const endTime = Date.now();
        const timeSpent = (endTime - (startTime || endTime)) / 1000;
        onComplete({
          wpm: Math.round((phrase.length / 5) / (timeSpent / 60)) || 0,
          accuracy: Math.round(((phrase.length - errors) / phrase.length) * 100),
          errors,
          totalChars: phrase.length,
          timeElapsed: timeSpent
        });
      }
    } else if (e.key.length === 1) {
      setErrors(prev => prev + 1);
    }
  }, [isActive, phrase, userInput, startTime, errors, onComplete]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const nextChar = phrase[userInput.length];
  const targetKeyCode = Object.keys(KEY_MAP).find(code => 
    KEY_MAP[code][language].toLowerCase() === nextChar?.toLowerCase()
  ) || (nextChar === ' ' ? 'Space' : '');

  const targetFinger = targetKeyCode ? FINGER_ZONES[targetKeyCode] : null;

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-5xl mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-xl font-black text-gray-700 uppercase tracking-tighter">Слепой метод</h3>
        <p className="text-sm text-gray-400">Не смотрите на клавиатуру, используйте подсказку пальца</p>
      </div>

      <div className="w-full bg-slate-900 p-10 rounded-3xl shadow-2xl border-4 border-slate-800">
        <div className="text-3xl font-mono leading-relaxed wrap-break-word text-white">
          {phrase.split('').map((char, i) => (
            <span key={i} className={i < userInput.length ? 'text-emerald-400' : i === userInput.length ? 'bg-blue-600 px-1' : 'text-slate-600'}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="bg-white px-8 py-4 rounded-2xl shadow-lg border-2 border-blue-100 flex flex-col items-center min-w-50">
          <span className="text-xs font-bold text-gray-400 uppercase">Нужный палец</span>
          <span className="text-lg font-black text-blue-600">
            {targetFinger ? FINGER_NAMES[targetFinger] : '---'}
          </span>
        </div>
        
        <div className="flex flex-col items-center bg-red-50 px-8 py-4 rounded-2xl border-2 border-red-100">
          <span className="text-xs font-bold text-red-400 uppercase">Ошибки</span>
          <span className="text-lg font-black text-red-600">{errors}</span>
        </div>
      </div>

      <VirtualKeyboard 
        language={language}
        targetKeyCode={targetKeyCode}
        lastPressedCode={lastEvent.code}
        isError={lastEvent.isError}
      />
    </div>
  );
};