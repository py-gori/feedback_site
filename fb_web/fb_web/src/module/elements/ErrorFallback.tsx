import React from 'react';
import { FallbackProps } from 'react-error-boundary';
import { Box } from '@mui/material';

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  return (
    <Box
      bgcolor="background.paper"
      className="text-red-500 w-screen h-screen flex flex-col justify-center items-center"
      role="alert"
    >
      <h1 className="text-lg font-semibold">予期せぬエラーが発生しました。</h1>
      <h2 className="text-lg font-semibold">{error.message}</h2>
    </Box>
  );
};

export default ErrorFallback;
