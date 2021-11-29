import React from 'react';

import {
  Button, ButtonGroup,
} from '@mui/material';

import { useAtom } from 'jotai';
import { useWeb3React } from '@web3-react/core';
import { appMode } from '../states';

import './Menu.css';

const textStyle = { fontFamily: 'Monospace', fontWeight: 'bold' };

const Menu = () => {
  const [, setMode] = useAtom(appMode);

  const { account } = useWeb3React();

  return (
    <div id="menu">
      <ButtonGroup sx={{ borderRadius: '15px' }} variant="contained" aria-label="outlined button group">
        <Button sx={textStyle} onClick={() => { setMode('swap'); }}>
          Swap
        </Button>
        <Button sx={textStyle} onClick={() => { setMode('pool'); }}>
          Pool
        </Button>
        {account === process.env.REACT_APP_DEPLOYER_ADDRESS && (
        <Button sx={textStyle} onClick={() => { setMode('withdraw'); }}>
          OWNER ONLY
        </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default Menu;
