import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { SettingsProvider } from './context/settingsContext';
import { ProtectedRoute } from './context/protectedRoute';
import { Welcome } from './pages/welcome/Welcome';

const Login = lazy(() => import('./pages/login').then(m => ({ default: m.Login })));
const ModuleRouter = lazy(() => import('./pages/ModuleRouter').then(m => ({ default: m.ModuleRouter })));
const ModulesPage = lazy(() => import('./pages/welcome/Modules').then(m => ({ default: m.ModulesPage })));
const Diagnostics = lazy(() => import('./pages/diagnostics/Diagnostics').then(m => ({ default: m.Diagnostics })));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Profile = lazy(() => import('./pages/profile').then(m => ({ default: m.Profile })));
const AdminGroups = lazy(() => import('./pages/admin/groupsPage').then(m => ({ default: m.AdminGroups })));
const AdminGroupDetails = lazy(() => import('./pages/admin/GroupStudentsPage').then(m => ({ default: m.AdminGroupDetails })));

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
              <div className="text-2xl font-bold">Загрузка...</div>
            </div>
          }>
            <Routes>
              {/* Публичный маршрут */}
              <Route path="/login" element={<Login />} />

              {/* Маршруты для студентов */}
              <Route path="/" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Welcome />
                </ProtectedRoute>
              } />
              <Route path="/modules" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ModulesPage />
                </ProtectedRoute>
              } />
              <Route path="/diagnostics" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Diagnostics />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/module/*" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <ModuleRouter />
                </ProtectedRoute>
              } />

              {/* Профиль — доступен всем авторизованным */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* Маршруты для админа */}
              <Route path="/admin/groups" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminGroups />
                </ProtectedRoute>
              } />
              <Route path="/admin/groups/:groupId" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminGroupDetails />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;