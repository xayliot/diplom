import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/welcome/Welcome';
import { ModuleRouter } from './pages/ModuleRouter';
import { ModulesPage } from './pages/welcome/Modules';
import { Diagnostics } from './pages/diagnostics/Diagnostics';
import { Dashboard } from './pages/dashboard/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/diagnostics" element={<Diagnostics />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/module/*" element={<ModuleRouter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
