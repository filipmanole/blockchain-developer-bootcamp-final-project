import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button } from '@mui/material';
import ChooseTokenModal from './ChooseTokenModal';
import './CustomInput.css';
import { TOKENS } from '../tokens';

export interface ICustomInput<T=string> {
  badInput?:boolean,
  tokens: T[],
  token: T,
  amount: string,
  setToken: (token: T) => void,
  setAmount: (input: string) => void,
  onInputChange?: () => void,
}

const boxStyle = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
  bgcolor: 'secondary.main',
  p: 1,
};

export const CustomInput: React.FC<ICustomInput> = ({
  badInput,
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
      sx={{ ...boxStyle, bgcolor: badInput ? 'warning.main' : 'secondary.main' }}
    >
      <Button
        onClick={handleOpen}
        id="symbol-button"
        variant="contained"
      >
        {TOKENS[token] ? TOKENS[token].symbol : 'Select a Token'}
        <KeyboardArrowDownIcon />
      </Button>
      <input
        autoComplete="off"
        disabled={!TOKENS[token]}
        id="amount-input"
        placeholder="0.0"
        value={amount}
        onChange={(e) => {
          if (onInputChange) onInputChange();
          if (e.target.value === '') setAmount('');
          if (isNumeric(e.target.value)) setAmount(e.target.value);
        }}
      />

      <ChooseTokenModal open={open} onClose={handleClose} tokens={tokens} setToken={setToken} />
    </Box>
  );
};
