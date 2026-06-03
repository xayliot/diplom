import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MouseModulePage } from './MouseModule/MouseModulePage';
import { KeyboardModulePage } from './KeyboardModule/KeyboardModulePage';
import { GuiModulePage } from './GuiModule/GuiModulePage';

const LevelPage = lazy(() => import('./LevelPage').then(module => ({ default: module.LevelPage })));

export const ModuleRouter: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="text-2xl font-bold">Загрузка модуля...</div>
      </div>
    }>
      <Routes>
        <Route path="mouse">
          <Route index element={<MouseModulePage />} />
          <Route path=":levelId" element={<LevelPage />} />
        </Route>

        <Route path="keyboard">
          <Route index element={<KeyboardModulePage />} />
          <Route path=":levelId" element={<LevelPage />} />
        </Route>

        <Route path="gui">
          <Route index element={<GuiModulePage />} />
          <Route path=":levelId" element={<LevelPage />} />
        </Route>

        <Route index element={<Navigate to="mouse" replace />} />
        <Route path="*" element={<Navigate to="mouse" replace />} />
      </Routes>
    </Suspense>
  );
};