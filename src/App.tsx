import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/welcome/Welcome';

const ModuleRouter = lazy(() => import('./pages/ModuleRouter').then(m => ({ default: m.ModuleRouter })));
const ModulesPage = lazy(() => import('./pages/welcome/Modules').then(m => ({ default: m.ModulesPage })));
const Diagnostics = lazy(() => import('./pages/diagnostics/Diagnostics').then(m => ({ default: m.Diagnostics })));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard').then(m => ({ default: m.Dashboard })));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
          <div className="text-2xl font-bold">Загрузка...</div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/module/*" element={<ModuleRouter />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;