import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/groups', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Редирект в зависимости от роли
      if (result.user?.role === 'admin') {
        navigate('/admin/groups');
      } else {
        navigate('/');
      }
    } else {
      setError(result.error || 'Ошибка входа');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            💻 Компьютерный тренажер
          </h1>
          <p className="text-slate-400">Войдите в систему для продолжения</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Логин
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Введите логин"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              placeholder="Введите пароль"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg text-sm text-slate-400 border border-slate-600">
          <p className="font-medium text-slate-300 mb-2">Демо-доступ:</p>
          <p>👨‍💼 Админ: <code className="text-purple-400">admin / admin123</code></p>
          <p>👨‍🎓 Студент: <code className="text-purple-400">student1 / student123</code></p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-slate-400 hover:text-white transition text-sm">
            ← На главную
          </Link>
        </div>
      </div>
    </div>
  );
}