import React from 'react';

import { Button } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { CustomInput, IToken } from './CustomInput';

import './Swap.css';

export interface ISwap {}

const tokens: IToken[] = [
  {
    name: 'DummyToken0',
    symbol: 'DT0',
  },
  {
    name: 'DummyToken1',
    symbol: 'DT1',
  },
];

const button = {
  borderRadius: 3,
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const Swap: React.FC<ISwap> = () => (
  <div id="swap-window">
    <div id="outer-test">
      <CustomInput tokens={tokens} />
      <CustomInput tokens={tokens} />
      <div id="arrow-div">
        <ArrowDownwardIcon style={{ fill: 'white' }} />
      </div>

    </div>

    <div>
      <Button sx={button} fullWidth variant="contained">
        SWAP
      </Button>
    </div>
  </div>
);

export default Swap;
