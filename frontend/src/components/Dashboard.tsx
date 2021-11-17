import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Paper, Button } from '@mui/material';

import { useAtom } from 'jotai';
import { appMode } from '../states';

import Swap from './Swap';
import Pool from './Pool';
import Menu from './Menu';
import Withdraw from './Withdraw';
import Signature from './Signature';

import injected from '../connectors';

const connectStyle = {
  position: 'absolute' as 'absolute',
  width: '100%',
  height: '100%',
  zIndex: '3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0)',
  backdropFilter: 'blur(10px)',
  borderRadius: '13px',
};

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const dashboardStyle = {
  display: 'grid',
  gridAutoRows: 'auto',
  rowGap: '8px',
  borderRadius: '13px',
  padding: '10px',
  width: '700px',

  position: 'relative' as 'relative',
};

const Dashboard = () => {
  const [mode] = useAtom(appMode);
  const { active, activate } = useWeb3React();

  return (
    <Paper sx={dashboardStyle}>
      {
        !active && (
          <Paper sx={connectStyle}>
            <Button
              sx={buttonStyle}
              variant="contained"
              onClick={() => activate(injected)}
            >
              Connect to Metamask
            </Button>
          </Paper>
        )
      }
      <Menu />
      {mode === 'swap' && <Swap />}
      {mode === 'pool' && <Pool />}
      {mode === 'withdraw' && <Withdraw />}
      <Signature />
    </Paper>
  );
};

export default Dashboard;
