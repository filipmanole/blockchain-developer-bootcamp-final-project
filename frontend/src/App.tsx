import React, { useMemo, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { grey, deepPurple } from '@mui/material/colors';

import { AppContext } from './AppContext';
import Swap from './components/Swap';
import Menu from './components/Menu';
import Signature from './components/Signature';

import './App.css';

const App = () => {
  const { appState } = useContext(AppContext);

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: appState.darkTheme === true ? 'dark' : 'light',
        primary: deepPurple,
        secondary: { main: appState.darkTheme === true ? grey[800] : grey[200] },
      },
    }),
    [appState.darkTheme],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Paper id="main-window">
        <Menu />
        <Swap />
        <Signature />
      </Paper>

    </ThemeProvider>
  );
};

export default App;
