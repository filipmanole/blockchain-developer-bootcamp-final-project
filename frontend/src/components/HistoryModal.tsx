import React from 'react';
import { Box, Modal } from '@mui/material';
import { TTokenBalance } from '../types';

interface IHistoryModal {
  open: boolean;
  onClose: () => void;
  history: TTokenBalance[];
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 2,

  display: 'grid',
  gridAutoRows: 'auto',
  rowGap: '10px',
};

const boxStyle = {
  display: 'flex',
  // alignItems: 'center',
  justifyContent: 'space-around',
  borderRadius: 4,
  bgcolor: 'secondary.main',
  p: 1,
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const HistoryModal: React.FC<IHistoryModal> = ({ open, onClose, history }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box
      sx={modalStyle}
    >
      <h3 style={{ fontFamily: 'Monospace', textAlign: 'center' }}>
        {
          history.length === 0 ? 'No transaction history to show...' : 'Transaction History'
        }
      </h3>
      {
        history.map((log, i) => (
          <Box
            sx={boxStyle}
            /* eslint-disable-next-line */
            key={i}>
            <div>{`${log.token}`}</div>
            <div>{`${log.balance}`}</div>

          </Box>
        ))
      }
    </Box>
  </Modal>
);

export default HistoryModal;
