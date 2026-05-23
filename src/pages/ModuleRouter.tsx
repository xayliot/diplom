import { Routes, Route, Navigate } from 'react-router-dom';
import { MouseModulePage } from './MouseModule/MouseModulePage';
import { LevelPage } from './MouseModule/LevelPage';
import { KeyboardModulePage } from './KeyboardModule/LevelPage';
import { KeyboardLevelPage } from './KeyboardModule/KeyboardModulePage';
import { GuiModulePage } from './GuiModule/GuiModulePage';
import { GuiLevelPage } from './GuiModule/LevelPage';

export const ModuleRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="mouse">
        <Route index element={<MouseModulePage />} />
        <Route path=":levelId" element={<LevelPage />} />
      </Route>

      <Route path="keyboard">
        <Route index element={<KeyboardModulePage />} />
        <Route path=":levelId" element={<KeyboardLevelPage />} />
      </Route>

      <Route path="gui">
        <Route index element={<GuiModulePage />} />
        <Route path=":levelId" element={<GuiLevelPage />} />
      </Route>

      <Route index element={<Navigate to="mouse" replace />} />
      
      <Route path="*" element={<Navigate to="mouse" replace />} />
    </Routes>
  );
};