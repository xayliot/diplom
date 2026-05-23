import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Диагностика',
      desc: 'Определим ваш уровень и подберём индивидуальный маршрут обучения.',
      icon: '📋',
      color: 'bg-emerald-500',
      shadow: 'shadow-emerald-200',
      path: '/diagnostics',
      label: 'Пройти проверку'
    },
    {
      title: 'Тренажёры',
      desc: 'Практические задания: от основ работы с мышью до слепой печати.',
      icon: '🎯',
      color: 'bg-indigo-600',
      shadow: 'shadow-indigo-200',
      path: '/modules',
      label: 'Начать тренировку'
    },
    {
      title: 'Прогресс',
      desc: 'Ваша персональная карта навыков, достижения и статистика успехов.',
      icon: '📊',
      color: 'bg-purple-600',
      shadow: 'shadow-purple-200',
      path: '/dashboard',
      label: 'Мои результаты'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Декоративный фон */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-indigo-50/50 to-transparent -z-10" />

      <div className="container mx-auto px-6 py-20">
        {/* Хедер */}
        <div className="text-center mb-24 animate-in fade-in slide-in-from-top-8 duration-700">

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 uppercase tracking-tighter leading-none">
            Мастер <br /> 
            <span className="text-indigo-600 italic">Компьютера</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Интерактивная платформа для тех, кто хочет чувствовать себя за клавиатурой как профи. 
            Прокачай скорость, точность и уверенность.
          </p>
        </div>

        {/* Сетка карточек */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="group bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col items-start transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 animate-in fade-in zoom-in-95 duration-700"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="text-5xl mb-8 group-hover:scale-125 transition-transform duration-500 grayscale group-hover:grayscale-0">
                {card.icon}
              </div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
                {card.title}
              </h2>
              
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                {card.desc}
              </p>
              
              <button
                onClick={() => navigate(card.path)}
                className={`mt-auto w-full ${card.color} text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl ${card.shadow} transition-all active:scale-95 group-hover:brightness-110`}
              >
                {card.label}
              </button>
            </div>
          ))}
        </div>

        {/* Футер-совет */}
        <div className="mt-24 text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.3em]">
            Рекомендуем начать с диагностики
          </p>
        </div>
      </div>
    </div>
  );
};