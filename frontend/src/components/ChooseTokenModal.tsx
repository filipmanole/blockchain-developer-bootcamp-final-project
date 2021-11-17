import React from 'react';
import { Box, Modal, Button } from '@mui/material';
import { TOKENS } from '../tokens';

interface IChooseTokenModal<T=string> {
  open: boolean;
  onClose: () => void;
  tokens: T[];
  setToken: (token: T) => void;
}

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

const textStyle = { fontFamily: 'Monospace', fontWeight: 'bold', textAlign: 'center' };

const ChooseTokenModal: React.FC<IChooseTokenModal> = ({
  open, onClose, tokens, setToken,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box
      sx={modalStyle}
    >
      {
        tokens.length === 0
          ? <p style={textStyle as React.CSSProperties}>No tokens available...</p>
          : tokens.map((t) => (
            <Button
              key={t as React.Key}
              fullWidth
              variant="contained"
              id="content-button"
              onClick={() => {
                setToken(t);
                onClose();
              }}
            >
              {TOKENS[t].symbol}
            </Button>
          ))
      }
    </Box>
  </Modal>
);

export default ChooseTokenModal;
