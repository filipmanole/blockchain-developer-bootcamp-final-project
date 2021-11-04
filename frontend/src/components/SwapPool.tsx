import React from 'react';

import { Button, Box, ButtonBase } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
/* eslint-disable-next-line */
import { BigNumber } from '@ethersproject/bignumber';
import { CustomInput } from './CustomInput';

import IToken from '../types/IToken';

import './SwapPool.css';

export interface ISwapPool {
  arrowButton?: boolean;
  buttonName: string;
}

const tokens: IToken[] = [
  {
    name: 'DummyToken0',
    symbol: 'DT0',
    address: '0xF2E246BB76DF876Cef8b38ae84130F4F55De395b',
  },
  {
    name: 'DummyToken1',
    symbol: 'DT1',
    address: '0x2946259E0334f33A064106302415aD3391BeD384',
  },
];

const button = {
  borderRadius: 3,
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const arrowStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  bgcolor: 'primary.main',
  border: '6px solid',
  borderRadius: '13px',
  borderColor: 'background.paper',

  display: 'flex',
  justifyContent: 'center',
  padding: '4px',

  boxShadow: 0,
  zIndex: 2,
};

const defaultToken: IToken = {
  name: '',
  symbol: '',
  address: '',
};

const SwapPool: React.FC<ISwapPool> = ({ arrowButton, buttonName }) => {
  const [token0, setToken0] = React.useState(defaultToken);
  const [token1, setToken1] = React.useState(defaultToken);
  const [amount0, setAmount0] = React.useState('');
  const [amount1, setAmount1] = React.useState('');

  const swap = () => {
    const auxToken = token0;
    const auxAmount = amount0;

    setToken0(token1);
    setAmount0(amount1);

    setToken1(auxToken);
    setAmount1(auxAmount);
  };

  return (
    <div id="swap-pool-window">
      <div id="swap-pool-inputs">
        <CustomInput
          tokens={tokens}
          token={token0}
          amount={amount0}
          setToken={setToken0}
          setAmount={setAmount0}
        />
        <CustomInput
          tokens={tokens}
          token={token1}
          amount={amount1}
          setToken={setToken1}
          setAmount={setAmount1}
        />
        {arrowButton
      && (
      <Box sx={arrowStyle}>
        <ButtonBase onClick={swap}>
          <ArrowDownwardIcon sx={{ fill: 'white' }} />
        </ButtonBase>
      </Box>
      )}
      </div>

      <div>
        <Button sx={button} fullWidth variant="contained">
          {buttonName}
        </Button>
      </div>
    </div>
  );
};

export default SwapPool;
