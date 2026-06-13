import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface ElderlyUser {
  id: number;
  fullName: string;
  age: number;
  email: string;
  phone: string;
  startDate: string;
  mouseProgress: number;
  keyboardProgress: number;
  guiProgress: number;
  avgProgress: number;
  lastActivity: string;
  notes: string;
}

// Имитация данных по группам
const MOCK_USERS_BY_GROUP: Record<number, ElderlyUser[]> = {
  1: [ // Начинающие
    {
      id: 1,
      fullName: 'Иванова Мария Петровна',
      age: 72,
      email: 'maria@mail.ru',
      phone: '+7 (900) 123-45-67',
      startDate: '2024-01-15',
      mouseProgress: 25,
      keyboardProgress: 10,
      guiProgress: 5,
      avgProgress: 13,
      lastActivity: '2024-03-20',
      notes: 'Требуется помощь с удержанием мыши'
    },
    {
      id: 2,
      fullName: 'Петров Иван Сергеевич',
      age: 68,
      email: 'petrov@mail.ru',
      phone: '+7 (900) 234-56-78',
      startDate: '2024-02-01',
      mouseProgress: 40,
      keyboardProgress: 20,
      guiProgress: 15,
      avgProgress: 25,
      lastActivity: '2024-03-19',
      notes: 'Хорошо осваивает клики'
    },
    {
      id: 3,
      fullName: 'Сидорова Анна Васильевна',
      age: 75,
      email: 'anna@mail.ru',
      phone: '+7 (900) 345-67-89',
      startDate: '2024-01-20',
      mouseProgress: 30,
      keyboardProgress: 15,
      guiProgress: 10,
      avgProgress: 18,
      lastActivity: '2024-03-18',
      notes: 'Боится нажимать на кнопки'
    },
  ],
  2: [ // Продолжающие
    {
      id: 4,
      fullName: 'Козлов Дмитрий Андреевич',
      age: 65,
      email: 'kozlov@mail.ru',
      phone: '+7 (900) 456-78-90',
      startDate: '2023-11-10',
      mouseProgress: 70,
      keyboardProgress: 55,
      guiProgress: 60,
      avgProgress: 62,
      lastActivity: '2024-03-21',
      notes: 'Уверенно работает с браузером'
    },
    {
      id: 5,
      fullName: 'Новикова Елена Валерьевна',
      age: 70,
      email: 'novikova@mail.ru',
      phone: '+7 (900) 567-89-01',
      startDate: '2023-12-05',
      mouseProgress: 75,
      keyboardProgress: 65,
      guiProgress: 55,
      avgProgress: 65,
      lastActivity: '2024-03-20',
      notes: 'Осваивает электронную почту'
    },
  ],
  3: [ // Уверенные
    {
      id: 6,
      fullName: 'Морозов Алексей Игоревич',
      age: 67,
      email: 'morozov@mail.ru',
      phone: '+7 (900) 678-90-12',
      startDate: '2023-09-01',
      mouseProgress: 85,
      keyboardProgress: 80,
      guiProgress: 75,
      avgProgress: 80,
      lastActivity: '2024-03-21',
      notes: 'Изучает установку программ'
    },
    {
      id: 7,
      fullName: 'Волкова Мария Денисовна',
      age: 63,
      email: 'volkova@mail.ru',
      phone: '+7 (900) 789-01-23',
      startDate: '2023-08-15',
      mouseProgress: 90,
      keyboardProgress: 88,
      guiProgress: 82,
      avgProgress: 87,
      lastActivity: '2024-03-20',
      notes: 'Активно пользуется госуслугами'
    },
  ],
  4: [ // Продвинутые
    {
      id: 8,
      fullName: 'Соколова Татьяна Михайловна',
      age: 60,
      email: 'sokolova@mail.ru',
      phone: '+7 (900) 890-12-34',
      startDate: '2023-06-01',
      mouseProgress: 95,
      keyboardProgress: 92,
      guiProgress: 90,
      avgProgress: 92,
      lastActivity: '2024-03-21',
      notes: 'Помогает другим обучающимся'
    },
  ],
};

const GROUP_INFO: Record<number, { title: string; icon: string; color: string }> = {
  1: { title: 'Начинающие', icon: '🌱', color: 'from-green-600 to-emerald-600' },
  2: { title: 'Продолжающие', icon: '🌿', color: 'from-blue-600 to-cyan-600' },
  3: { title: 'Уверенные', icon: '🌳', color: 'from-purple-600 to-pink-600' },
  4: { title: 'Продвинутые', icon: '🎓', color: 'from-orange-600 to-yellow-600' },
};

export function AdminGroupDetails() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'fullName' | 'avgProgress' | 'lastActivity'>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const groupIdNum = Number(groupId);
  const groupInfo = GROUP_INFO[groupIdNum];
  const users = MOCK_USERS_BY_GROUP[groupIdNum] || [];

  // Сортировка и фильтрация
  const filteredUsers = users
    .filter((u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'fullName') {
        return multiplier * a.fullName.localeCompare(b.fullName);
      }
      return multiplier * (a[sortField] as number) - (b[sortField] as number);
    });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const avgGroupProgress = users.length
    ? Math.round(users.reduce((sum, u) => sum + u.avgProgress, 0) / users.length)
    : 0;

  if (!groupInfo) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🤷</p>
          <p className="text-xl text-white mb-4">Группа не найдена</p>
          <button
            onClick={() => navigate('/admin/groups')}
            className="text-purple-400 hover:text-purple-300 transition"
          >
            ← Вернуться к списку групп
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/admin/groups')}
            className="text-slate-300 hover:text-white mb-2 inline-block transition text-sm"
          >
            ← Назад к группам
          </button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{groupInfo.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-white">{groupInfo.title}</h1>
              <p className="text-slate-300 text-sm">
                Обучающихся: {users.length} | Средний прогресс: {avgGroupProgress}%
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Поиск */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Поиск по имени..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>

        {/* Таблица */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">№</th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('fullName')}
                  >
                    ФИО {sortField === 'fullName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Возраст</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Контакты</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Мышь</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Клав.</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">GUI</th>
                  <th
                    className="px-6 py-3 text-left text-sm font-semibold text-slate-300 cursor-pointer hover:text-white transition"
                    onClick={() => handleSort('avgProgress')}
                  >
                    Средний {sortField === 'avgProgress' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-300">Примечания</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4 text-sm text-slate-400">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.fullName}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        Начало: {user.startDate} | Активность: {user.lastActivity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{user.age} лет</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-blue-400">{user.email}</div>
                      <div className="text-xs text-slate-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBadge value={user.mouseProgress} />
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBadge value={user.keyboardProgress} />
                    </td>
                    <td className="px-6 py-4">
                      <ProgressBadge value={user.guiProgress} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-[80px]">
                          <div
                            className={`bg-gradient-to-r ${groupInfo.color} h-2 rounded-full`}
                            style={{ width: `${user.avgProgress}%` }}
                          />
                        </div>
                        <span className="text-white font-semibold text-sm">{user.avgProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-400">{user.notes}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-6xl mb-4">👨‍🦳</p>
            <p className="text-xl">Обучающиеся не найдены</p>
          </div>
        )}
      </main>
    </div>
  );
}

function ProgressBadge({ value }: { value: number }) {
  const color =
    value >= 80
      ? 'bg-green-900/50 text-green-400 border border-green-700'
      : value >= 60
      ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
      : value >= 30
      ? 'bg-orange-900/50 text-orange-400 border border-orange-700'
      : 'bg-red-900/50 text-red-400 border border-red-700';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {value}%
    </span>
  );
}