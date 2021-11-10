import React, { Key } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box, Button, Modal,
} from '@mui/material';

import { AddressZero } from '@ethersproject/constants';
import IToken from '../types/IToken';

import './CustomInput.css';

export interface ICustomInput {
  tokens: IToken[],
  token: IToken,
  amount: string,
  setToken: (token: IToken) => void,
  setAmount: (input: string) => void,
  onInputChange?: () => void,
}

const textStyle = { fontFamily: 'Monospace', fontWeight: 'bold', textAlign: 'center' };

const boxStyle = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
  bgcolor: 'secondary.main',
  p: 1,
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  border: '1px solid grey',
  p: 1,
};

export const CustomInput: React.FC<ICustomInput> = ({
  tokens,
  token,
  amount,
  setToken,
  setAmount,
  onInputChange,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  /* eslint-disable-next-line */
  const isNumeric = (str:string): boolean => !isNaN(str as unknown as number) && !isNaN(parseFloat(str));

  return (
    <Box
      sx={boxStyle}
    >
      <Button
        onClick={handleOpen}
        id="symbol-button"
        variant="contained"
      >
        {token.address !== AddressZero ? token.symbol : 'Select a Token'}
        <KeyboardArrowDownIcon />
      </Button>
      <input
        autoComplete="off"
        disabled={token.address === AddressZero}
        id="amount-input"
        placeholder="0.0"
        value={amount}
        onChange={(e) => {
          if (onInputChange) onInputChange();
          if (e.target.value === '') setAmount('');
          if (isNumeric(e.target.value)) setAmount(e.target.value);
        }}
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          id="select-modal"
          sx={modalStyle}
        >
          {
            tokens.length === 0
              ? <p style={textStyle as React.CSSProperties}>No tokens available...</p>
              : tokens.map((t) => (
                <Button
                  key={t.address as Key}
                  fullWidth
                  variant="contained"
                  id="content-button"
                  onClick={() => {
                    setToken(t);
                    handleClose();
                  }}
                >
                  {t.symbol}
                </Button>
              ))
          }
        </Box>
      </Modal>
    </Box>
  );
};
