import React, { useState } from 'react';
import type { KeyboardLevelConfig, KeyboardStats } from '../ModuleB_Keyboard/levels/index'
import  { Level1_Orientation, Level2_SimpleWords, Level3_Phrases, Level4_TenFingers } from '../ModuleB_Keyboard/levels/index'


interface KeyboardTrainerProps {
  level: KeyboardLevelConfig;
  onComplete: (stats: KeyboardStats) => void;
}

export const KeyboardTrainer: React.FC<KeyboardTrainerProps> = ({ level, onComplete }) => {
  const [language, setLanguage] = useState<'ru' | 'en'>('ru');

  const renderLevelContent = () => {
    const normalizedLevel = {
      ...level,
      id: typeof level.id === 'string' ? parseInt(level.id.replace(/\D/g, ''), 10) || 0 : level.id
    };

    const commonProps = {
      level: normalizedLevel,
      language,
      isActive: true,
      onComplete
    };

    const levelKey = level.id.toString();

    switch (levelKey) {
      case '1':
      case 'k1': 
        return <Level1_Orientation {...commonProps} />;
      case '2':
      case 'k2': 
        return <Level2_SimpleWords {...commonProps} />;
      case '3':
      case 'k3': 
        return <Level3_Phrases {...commonProps} />;
      case '4':
      case 'k4': 
        return <Level4_TenFingers {...commonProps} />;
      default: 
        return (
          <div className="p-10 text-center text-gray-400 font-bold bg-white rounded-3xl border-2 border-dashed border-gray-200">
            Контент для уровня "{level.title}" еще в разработке
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 font-sans">
      <div className="flex justify-between items-center mb-12 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
            {language === 'ru' ? 'Тренажер' : 'Trainer'}
          </h1>
          <p className="text-gray-400 font-medium">Режим: {level.title}</p>
        </div>

        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {(['ru', 'en'] as const).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-8 py-2.5 rounded-xl font-bold transition-all ${
                language === lang 
                  ? 'bg-white shadow-lg text-green-600' 
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        {renderLevelContent()}
      </div>
    </div>
  );
};