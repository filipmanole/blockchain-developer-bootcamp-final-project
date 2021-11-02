import React, { useMemo, useContext } from 'react';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { grey, deepPurple } from '@mui/material/colors';

import { AppContext } from './AppContext';
import WalletConnect from './components/WalletConnect';
import SwapPool from './components/SwapPool';
import Menu from './components/Menu';
import Signature from './components/Signature';

import './App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

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
      <Web3ReactProvider getLibrary={getLibrary}>
        <div id="main-div">
          <Paper id="main-bar">
            <WalletConnect />
          </Paper>
          <Paper id="main-window">
            <Menu />
            {appState.mode === 'swap' && <SwapPool arrowButton buttonName="SWAP" />}
            {appState.mode === 'pool' && <SwapPool buttonName="ADD POOL" />}
            <Signature />
          </Paper>
        </div>
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default App;
