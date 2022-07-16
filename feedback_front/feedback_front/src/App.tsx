import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';
import { Box } from '@mui/material';

// import './App.css';
import { AuthProvider } from '@/providers/auth';
import { ColorModeProvider } from '@/providers/colorMode';
import AppRoutes from './routes';
import Header from '@/module/header/Header';
import Notifications from '@/module/elements/Notifications';
import Spinner from '@/module/elements/Spinner';
import ErrorFallback from './module/elements/ErrorFallback';

const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <React.Suspense
        fallback={(
          <Box bgcolor="background.paper" className="flex items-center justify-center w-screen h-screen">
            <Spinner />
          </Box>
        )}
      >
        <ColorModeProvider>
          <RecoilRoot>
            <Router>
              <AuthProvider>
                <Header />
                <Notifications />
                <AppRoutes />
              </AuthProvider>
            </Router>
          </RecoilRoot>
        </ColorModeProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default App;
