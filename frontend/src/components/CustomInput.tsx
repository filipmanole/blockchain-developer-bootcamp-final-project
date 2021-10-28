import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button } from '@mui/material';

// import { InputUnstyled } from '@mui/core';

import './CustomInput.css';

export interface ICustomInput {}

const boxStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'primary.dark',
  borderRadius: 4,
  p: 1,
};

export const CustomInput: React.FC<ICustomInput> = () => (
  <Box
    sx={boxStyle}
  >
    <Button
      id="symbol-button"
      variant="contained"
    >
      DTX
      <KeyboardArrowDownIcon />
    </Button>
    <input
      id="amount-input"
      placeholder="0.0"
    />
  </Box>
);
