import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

interface ElderlyGroup {
  id: number;
  title: string;
  description: string;
  icon: string;
  level: string;
  usersCount: number;
  avgProgress: number;
  color: string;
}

const MOCK_GROUPS: ElderlyGroup[] = [
  {
    id: 1,
    title: 'Начинающие',
    description: 'Никогда не работали с компьютером. Учатся с самых азов: включение, мышь, рабочий стол.',
    icon: '🌱',
    level: 'Базовый',
    usersCount: 3,
    avgProgress: 19,
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 2,
    title: 'Продолжающие',
    description: 'Умеют пользоваться мышью и клавиатурой. Осваивают программы, браузер, электронную почту.',
    icon: '🌿',
    level: 'Средний',
    usersCount: 2,
    avgProgress: 64,
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 3,
    title: 'Уверенные',
    description: 'Уверенно работают в Windows. Изучают продвинутые функции: установка программ, настройки системы.',
    icon: '🌳',
    level: 'Продвинутый',
    usersCount: 8,
    avgProgress: 78,
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 4,
    title: 'Продвинутые',
    description: 'Активно используют интернет и госуслуги. Изучают цифровую безопасность и онлайн-сервисы.',
    icon: '🎓',
    level: 'Эксперт',
    usersCount: 5,
    avgProgress: 91,
    color: 'from-orange-600 to-yellow-600'
  },
];

export function AdminGroups() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = MOCK_GROUPS.filter(
    (g) =>
      g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalUsers = MOCK_GROUPS.reduce((sum, g) => sum + g.usersCount, 0);
  const totalAvgProgress = Math.round(
    MOCK_GROUPS.reduce((sum, g) => sum + g.avgProgress * g.usersCount, 0) / totalUsers
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">👥 Группы обучающихся</h1>
            <p className="text-slate-300 text-sm">Распределение по уровню подготовки</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">👨‍💼 {currentUser?.fullName}</span>
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-white transition text-sm"
            >
              Тренажер
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition text-white text-sm"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold">{MOCK_GROUPS.length}</p>
            <p className="text-purple-100">Групп подготовки</p>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold">{totalUsers}</p>
            <p className="text-green-100">Всего обучающихся</p>
          </div>
          <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold">{totalAvgProgress}%</p>
            <p className="text-orange-100">Средний прогресс</p>
          </div>
        </div>

        {/* Поиск */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск по названию или уровню..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Сетка групп */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/admin/groups/${group.id}`)}
              className="bg-slate-800 rounded-xl border border-slate-700 hover:border-purple-500 transition-all cursor-pointer hover:shadow-lg hover:shadow-purple-500/10 group"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`bg-gradient-to-br ${group.color} p-4 rounded-xl text-4xl shadow-lg`}>
                    {group.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition">
                          {group.title}
                        </h3>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${group.color} text-white`}>
                          {group.level}
                        </span>
                      </div>
                      <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">
                        {group.usersCount} чел.
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {group.description}
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Прогресс группы</span>
                    <span className="text-white font-semibold">{group.avgProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                      className={`bg-gradient-to-r ${group.color} h-2.5 rounded-full transition-all duration-500`}
                      style={{ width: `${group.avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700 px-6 py-4 flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  {group.usersCount} обучающихся
                </span>
                <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Посмотреть список
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl">Группы не найдены</p>
          </div>
        )}
      </main>
    </div>
  );
}