import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import PostsRoutes from '@/module/posts/routes';
import RoadmapRoutes from '@/module/roadmap/routes';
import Spinner from '@/module/elements/Spinner';

const App = () => {
  return (
    <React.Suspense
      fallback={(
        <Box
          bgcolor="background.paper"
          className="flex items-center justify-center w-screen h-screen"
        >
          <Spinner />
        </Box>
      )}
    >
      <Outlet />
    </React.Suspense>
  );
};

const protectedRoutes = [
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/posts/feedbacks/*', element: <PostsRoutes /> },
      { path: '/posts/bugs/*', element: <PostsRoutes /> },
      { path: '/posts', element: <RoadmapRoutes /> },
    ],
  },
];

export default protectedRoutes;
