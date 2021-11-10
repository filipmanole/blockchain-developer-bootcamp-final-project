import React from 'react';

import { useWeb3React } from '@web3-react/core';
import { Box, ButtonBase, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useAtom } from 'jotai';

import { appTheme, connectModalState } from '../states';
import ConnectModal from './ConnectModal';

import './WalletConnect.css';

export interface IWalletConnect {}

const statusStyle = {
  display: 'flex',
  flexDirection: 'row' as 'row',
  width: '160px',

  bgcolor: 'secondary.main',
  borderRadius: '13px',
};

const WalletConnect: React.FC<IWalletConnect> = () => {
  const [, setModalState] = useAtom(connectModalState);

  const [theme, setTheme] = useAtom(appTheme);
  const { active, account } = useWeb3React();

  const excerpAddress = (address: string) => {
    const len = address.length;
    if (len < 42) return address; // 42 number of elements in an ethereum address
    return `${address.substring(0, 5)}...${address.substring(len - 4, len)}`;
  };

  return (
    <>
      <h1>swapper</h1>
      <IconButton
        color="inherit"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        <Brightness4Icon />
      </IconButton>
      <Box sx={statusStyle}>
        <ButtonBase
          sx={{
            display: 'flex',
            flexDirection: 'row' as 'row',
            justifyContent: 'flex-start',
            borderRadius: '13px',
            width: '100%',
            pl: '10px',
          }}
          onClick={() => setModalState(true)}
        >
          {active
            ? (
              <>
                <FiberManualRecordIcon style={{ fontSize: 15, fill: 'green' }} />
                &nbsp;&nbsp;
                <h3 style={{ fontFamily: 'Monospace' }}>{excerpAddress(account)}</h3>
              </>
            )
            : (
              <>
                <FiberManualRecordIcon style={{ fontSize: 15, fill: 'orange' }} />
                &nbsp;&nbsp;
                <h3 style={{ fontFamily: 'Monospace' }}>Not connected</h3>
              </>
            )}
        </ButtonBase>
      </Box>
      <ConnectModal />
    </>
  );
};

export default WalletConnect;
