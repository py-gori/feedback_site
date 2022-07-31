import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blueGrey, grey } from '@mui/material/colors';

// heroicons: https://heroicons.com/
// Sample: https://mui.com/customization/dark-mode/#toggling-color-mode

export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

type ColorModeProviderProps = {
  children: React.ReactNode;
}

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          if (prevMode === 'light') {
            localStorage.setItem('paletteMode', 'dark');
            return 'dark';
          }
          localStorage.setItem('paletteMode', 'light');
          return 'light';
        });
      },
    }),
    [],
  );

  useEffect(() => {
    if (localStorage.getItem('paletteMode') === 'dark') {
      setMode('dark');
    } else {
      setMode('light');
    }
  }, [mode]);

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode,
        ...(mode === 'light'
          ? {
            primary: blueGrey,
            divider: blueGrey[200],
            text: {
              primary: grey[900],
              secondary: grey[800],
            },
          }
          : {
            primary: grey,
            divider: grey[700],
            background: {
              default: grey[900],
              paper: '#1d1d1d',
            },
            text: {
              primary: '#fff',
              secondary: grey[500],
            },
          }),
      },
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
