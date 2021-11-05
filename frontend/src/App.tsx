import React, { useMemo } from 'react';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Paper, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { grey, deepPurple } from '@mui/material/colors';

import { useAtom } from 'jotai';
import { appTheme, appMode } from './states';

import WalletConnect from './components/WalletConnect';
import SwapPool from './components/SwapPool';
import Menu from './components/Menu';
import Signature from './components/Signature';

import './App.css';

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  const [theme] = useAtom(appTheme);
  const [mode] = useAtom(appMode);

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
          <Paper id="main-window">
            <Menu />
            {mode === 'swap' && <SwapPool arrowButton buttonName="SWAP" />}
            {mode === 'pool' && <SwapPool buttonName="ADD POOL" />}
            {mode === 'withdraw' && (
            <Button
              sx={{
                fontFamily: 'Monospace',
                fontWeight: 'bold',
                fontSize: '20px',
                borderRadius: '13px',
              }}
              variant="contained"
              fullWidth
            >
              Withdraw
            </Button>
            )}
            <Signature />
          </Paper>
        </div>
      </Web3ReactProvider>
    </ThemeProvider>
  );
};

export default App;
