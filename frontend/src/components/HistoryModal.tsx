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

// const buttonStyle = {
//   borderRadius: '13px',
//   fontFamily: 'Monospace',
//   fontSize: '20px',
//   fontWeight: 'bold',
// };

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
      {console.log('from modal', history)}
      {
        history.map((log, i) => (
          <div
            /* eslint-disable-next-line */
            key={i}>
            {`${log.token} ${log.balance.toString()}`}

          </div>
        ))
      }
    </Box>
  </Modal>
);

export default HistoryModal;
