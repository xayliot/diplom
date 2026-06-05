import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useSettings } from '../context/settingsContext';

export function Profile() {
  const { currentUser, logout } = useAuth();
  const { settings, updateSettings, resetSettings } = useSettings();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-blue-900 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">⚙️ Настройки профиля</h1>
            <p className="text-slate-300 text-sm">{currentUser?.fullName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-slate-300 hover:text-white transition text-sm"
            >
              ← На главную
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Информация о пользователе */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">👤 Личная информация</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Имя</label>
              <div className="text-white bg-slate-700 px-4 py-2 rounded-lg">
                {currentUser?.fullName}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Логин</label>
              <div className="text-white bg-slate-700 px-4 py-2 rounded-lg">
                {currentUser?.username}
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Роль</label>
              <div className="text-white bg-slate-700 px-4 py-2 rounded-lg capitalize">
                {currentUser?.role === 'admin' ? '👨‍💼 Администратор' : '👨‍🎓 Студент'}
              </div>
            </div>
            {currentUser?.groupId && (
              <div>
                <label className="block text-sm text-slate-400 mb-1">Группа</label>
                <div className="text-white bg-slate-700 px-4 py-2 rounded-lg">
                  Группа {currentUser.groupId}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Настройки мыши */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">🖱️ Настройки мыши</h2>
          
          <div className="space-y-6">
            {/* Скорость мыши */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-slate-300">Скорость указателя</label>
                <span className="text-sm text-purple-400">{settings.mouseSpeed}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.mouseSpeed}
                onChange={(e) => updateSettings({ mouseSpeed: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Медленно</span>
                <span>Быстро</span>
              </div>
            </div>

            {/* Размер курсора */}
            <div>
              <label className="block text-sm text-slate-300 mb-3">Размер курсора</label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ cursorSize: size })}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      settings.cursorSize === size
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {size === 'small' ? '↖️' : size === 'medium' ? '🖱️' : '🖲️'}
                    </div>
                    <div className="text-sm">
                      {size === 'small' ? 'Маленький' : size === 'medium' ? 'Средний' : 'Большой'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Настройки отображения */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">👁️ Отображение</h2>
          
          <div className="space-y-6">
            {/* Размер шрифта */}
            <div>
              <label className="block text-sm text-slate-300 mb-3">Размер шрифта</label>
              <div className="grid grid-cols-3 gap-3">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ fontSize: size })}
                    className={`p-4 rounded-lg border-2 transition text-center ${
                      settings.fontSize === size
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {size === 'normal' ? '📝' : size === 'large' ? '📄' : '📰'}
                    </div>
                    <div className="text-sm">
                      {size === 'normal' ? 'Обычный' : size === 'large' ? 'Крупный' : 'Очень крупный'}
                    </div>
                    <div className={`mt-2 ${
                      size === 'normal' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-xl'
                    }`}>
                      Аа
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Высокий контраст */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-slate-300">Высокий контраст</label>
                <p className="text-xs text-slate-500 mt-1">Улучшает видимость элементов</p>
              </div>
              <button
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className={`relative w-14 h-8 rounded-full transition ${
                  settings.highContrast ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                    settings.highContrast ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Скорость анимаций */}
            <div>
              <label className="block text-sm text-slate-300 mb-3">Скорость анимаций</label>
              <div className="grid grid-cols-3 gap-3">
                {(['slow', 'normal', 'fast'] as const).map((speed) => (
                  <button
                    key={speed}
                    onClick={() => updateSettings({ animationSpeed: speed })}
                    className={`p-4 rounded-lg border-2 transition ${
                      settings.animationSpeed === speed
                        ? 'border-purple-500 bg-purple-500/20 text-white'
                        : 'border-slate-600 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {speed === 'slow' ? '🐢' : speed === 'normal' ? '🐇' : '🚀'}
                    </div>
                    <div className="text-sm">
                      {speed === 'slow' ? 'Медленно' : speed === 'normal' ? 'Обычно' : 'Быстро'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Настройки звука */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">🔊 Звук</h2>
          
          <div className="space-y-6">
            {/* Включение звука */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-slate-300">Звуковые эффекты</label>
                <p className="text-xs text-slate-500 mt-1">Звуки при выполнении заданий</p>
              </div>
              <button
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`relative w-14 h-8 rounded-full transition ${
                  settings.soundEnabled ? 'bg-purple-600' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition ${
                    settings.soundEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Громкость */}
            {settings.soundEnabled && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-slate-300">Громкость</label>
                  <span className="text-sm text-purple-400">{settings.soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.soundVolume}
                  onChange={(e) => updateSettings({ soundVolume: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>🔈</span>
                  <span>🔊</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition"
          >
            {saved ? '✅ Сохранено!' : '💾 Сохранить настройки'}
          </button>
          <button
            onClick={resetSettings}
            className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-700 transition"
          >
            🔄 Сбросить
          </button>
        </div>
      </main>
    </div>
  );
}