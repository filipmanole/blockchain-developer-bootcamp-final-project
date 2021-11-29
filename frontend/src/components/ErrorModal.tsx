import React from 'react';

import { useAtom } from 'jotai';
import { Button, Box, Modal } from '@mui/material';

import { appError } from '../states';

interface IErrorModal {
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
  p: 1,

  display: 'grid',
  gridAutoRows: 'auto',
  justifyItems: 'center',
  rowGap: '10px',
};

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const ErrorModal: React.FC<IErrorModal> = () => {
  const [error, setError] = useAtom(appError);
  return (
    <Modal
      open={error}
      onClose={() => setError(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        id="select-modal"
        sx={modalStyle}
      >
        <h3 style={{ fontFamily: 'Monospace' }}>An error has occured</h3>
        <Button fullWidth sx={buttonStyle} variant="contained"> Refresh </Button>
      </Box>
    </Modal>
  );
};

export default ErrorModal;
