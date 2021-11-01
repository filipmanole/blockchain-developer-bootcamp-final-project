import React from 'react';

import { Button, Box, ButtonBase } from '@mui/material';
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

const Swap: React.FC<ISwap> = () => (
  <div id="swap-window">
    <div id="swap-inputs">
      <CustomInput tokens={tokens} />
      <CustomInput tokens={tokens} />
      <Box sx={arrowStyle}>
        <ButtonBase>
          <ArrowDownwardIcon sx={{ fill: 'white' }} />
        </ButtonBase>
      </Box>
    </div>

    <div>
      <Button sx={button} fullWidth variant="contained">
        SWAP
      </Button>
    </div>
  </div>
);

export default Swap;
