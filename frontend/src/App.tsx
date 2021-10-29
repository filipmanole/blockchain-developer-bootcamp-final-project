import React, { useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IconButton, Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import blue from '@mui/material/colors/blue';
import Brightness4Icon from '@mui/icons-material/Brightness4';

import { AppContext } from './AppContext';
import Swap from './components/Swap';
import Signature from './components/Signature';

import './App.css';

const App = () => {
  const { appState, setAppState } = useContext(AppContext);

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: appState.darkTheme === true ? 'dark' : 'light',
        primary: blue,
      },
    }),
    [appState.darkTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Paper>

        <IconButton
          color="inherit"
          onClick={() => setAppState((prevAppState) => ({
            darkTheme: !prevAppState.darkTheme,
          }))}
        >
          <Brightness4Icon />
        </IconButton>

        <Swap />

        <Signature />

      </Paper>

    </ThemeProvider>
  );
};

export default App;
