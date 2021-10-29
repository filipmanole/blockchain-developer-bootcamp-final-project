import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Box, Button, Modal,
} from '@mui/material';

import './CustomInput.css';

export interface IToken {
  name: string,
  symbol: string,
}

export interface ICustomInput {
  tokens: IToken[]
}

const boxStyle = {
  display: 'flex',
  alignItems: 'center',
  borderRadius: 4,
  p: 1,
};

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 1,
};

export const CustomInput: React.FC<ICustomInput> = ({ tokens }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [token, setToken] = React.useState('Select a Token');

  return (
    <Box
      sx={boxStyle}
    >
      <Button
        onClick={handleOpen}
        id="symbol-button"
        variant="contained"
      >
        {token}
        <KeyboardArrowDownIcon />
      </Button>
      <input
        id="amount-input"
        placeholder="0.0"
      />

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          id="select-modal"
          sx={style}
        >
          {tokens.map((t) => (
            <>
              <Button
                fullWidth
                variant="contained"
                id="content-button"
                onClick={() => {
                  setToken(t.symbol);
                  handleClose();
                }}
              >
                {t.symbol}
              </Button>
              <br />
            </>
          ))}
        </Box>
      </Modal>
    </Box>
  );
};
