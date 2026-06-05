import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

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
    <div className="h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-indigo-50/50 to-transparent -z-10" />

      {/* Хедер с профилем */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-sm text-slate-400 font-medium">
          👨‍🎓 {currentUser?.fullName}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-md"
          >
            <span className="text-lg">⚙️</span>
            <span>Настройки</span>
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 hover:border-red-200 hover:shadow-md"
          >
            <span className="text-lg">🚪</span>
            <span>Выйти</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 flex flex-col grow justify-center">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 uppercase tracking-tighter leading-none">
            Мастер <br /> 
            <span className="text-indigo-600 italic">Компьютера</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Интерактивная платформа для тех, кто хочет чувствовать себя за клавиатурой как профи. 
            Прокачай скорость, точность и уверенность.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="group bg-white rounded-4xl p-8 shadow-sm border border-slate-100 flex flex-col items-start transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200 animate-in fade-in zoom-in-95 duration-700"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-500 grayscale group-hover:grayscale-0">
                {card.icon}
              </div>
              
              <h2 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">
                {card.title}
              </h2>
              
              <p className="text-slate-500 font-medium mb-8 leading-relaxed text-sm">
                {card.desc}
              </p>
              
              <button
                onClick={() => navigate(card.path)}
                className={`mt-auto w-full ${card.color} text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl ${card.shadow} transition-all active:scale-95 group-hover:brightness-110`}
              >
                {card.label}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">
            Рекомендуем начать с диагностики
          </p>
        </div>
      </div>
    </div>
  );
};