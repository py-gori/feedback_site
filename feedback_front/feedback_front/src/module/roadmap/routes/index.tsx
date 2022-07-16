import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Roadmap from '../Roadmap';
import ErrorFallback from '@/module/elements/ErrorFallback';

const RoadmapRoutes = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="" element={<Roadmap />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default RoadmapRoutes;
