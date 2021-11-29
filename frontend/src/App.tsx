import React, { useMemo } from 'react';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { grey, deepPurple } from '@mui/material/colors';

import { useAtom } from 'jotai';
import { appTheme } from './states';

import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import ErrorModal from './components/ErrorModal';

import './App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  const [theme] = useAtom(appTheme);

  const customTheme = useMemo(
    () => createTheme({
      palette: {
        mode: theme,
        primary: deepPurple,
        secondary: { main: theme === 'dark' ? grey[800] : grey[200] },
      },
    }),
    [theme],
  );

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <Web3ReactProvider getLibrary={getLibrary}>
        <div id="main-div">
          <Paper id="main-bar">
            <WalletConnect />
          </Paper>
          <Dashboard />
        </div>
        <ErrorModal />
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default App;
