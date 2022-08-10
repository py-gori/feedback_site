import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import Posts from '../Posts';
import Detail from '../Detail';
import ErrorFallback from '@/module/elements/ErrorFallback';

const PostsRoutes = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route path="" element={<Posts />} />
        <Route path=":id" element={<Detail />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default PostsRoutes;
