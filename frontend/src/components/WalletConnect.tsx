import React, { useContext } from 'react';

import { useWeb3React } from '@web3-react/core';
import {
  Button, Box, ButtonBase, IconButton, Modal,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { injected } from '../connectors';

import { AppContext } from '../AppContext';

import './WalletConnect.css';

export interface IWalletConnect {}

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

const statusStyle = {
  display: 'flex',
  flexDirection: 'row' as 'row',
  width: '150px',

  bgcolor: 'secondary.main',
  borderRadius: '13px',
};

const WalletConnect: React.FC<IWalletConnect> = () => {
  const { dispatchState } = useContext(AppContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    active,
    account,
    activate,
    deactivate,
  } = useWeb3React();

  const connect = async () => {
    await activate(injected); /* TODO handle exception */
  };
  const deconnect = () => {
    deactivate();
  };

  const excerpAddress = (address: string) => {
    const len = address.length;
    if (len < 42) return address; // 42 number of elements in an ethereum address
    return `${address.substring(0, 5)}...${address.substring(len - 4, len)}`;
  };

  return (
    <>
      <h1>swapper</h1>
      <IconButton
        color="inherit"
        onClick={() => dispatchState({ type: 'SWITCH_THEME' })}
      >
        <Brightness4Icon />
      </IconButton>
      <Box sx={statusStyle}>
        <ButtonBase
          sx={{
            display: 'flex',
            flexDirection: 'row' as 'row',
            justifyContent: 'flex-start',
            borderRadius: '13px',
            width: '100%',
            pl: '10px',
          }}
          onClick={handleOpen}
        >
          {active
            ? (
              <>
                <FiberManualRecordIcon style={{ fontSize: 15, fill: 'green' }} />
                &nbsp;&nbsp;
                <h3>{excerpAddress(account)}</h3>
              </>
            )
            : (
              <>
                <FiberManualRecordIcon style={{ fontSize: 15, fill: 'orange' }} />
                &nbsp;&nbsp;
                <h3>Not connected</h3>
              </>
            )}
        </ButtonBase>
      </Box>

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
            active
              ? (
                <>
                  <h3>{account}</h3>
                  <Button fullWidth style={{ borderRadius: '10px' }} onClick={() => { deconnect(); }} variant="contained"> Deconnect </Button>
                </>
              ) : (
                <>
                  <h3>Not Connected</h3>
                  <Button fullWidth style={{ borderRadius: '10px' }} onClick={() => { connect(); }} variant="contained"> Connect </Button>
                </>
              )
          }
        </Box>
      </Modal>
    </>
  );
};

export default WalletConnect;
