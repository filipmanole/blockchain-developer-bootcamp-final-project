import React from 'react';

import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import { Signer } from 'ethers';
import { Button, Box, Modal } from '@mui/material';
import { swapperContract, signerAccount, connectModalState } from '../states';
import { Swapper__factory } from '../typechain';

import injected from '../connectors';

interface IConnectModal {
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

const ConnectModal: React.FC<IConnectModal> = () => {
  const [modalState, setModalState] = useAtom(connectModalState);
  const [, setSwapper] = useAtom(swapperContract);
  const [, setSigner] = useAtom(signerAccount);
  const {
    active, account, library, activate, deactivate,
  } = useWeb3React();

  const connect = async () => {
    await activate(injected); /* TODO handle exception */
  };
  const deconnect = () => {
    deactivate();
  };

  React.useEffect(() => {
    if (active) {
      const signer = library.getSigner(account).connectUnchecked();
      setSigner(signer);
      setSwapper(Swapper__factory.connect('0x153b84F377C6C7a7D93Bd9a717E48097Ca6Cfd11', signer as Signer));
    }
  },
  [account]);

  return (
    <Modal
      open={modalState}
      onClose={() => setModalState(false)}
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
            <h3 style={{ fontFamily: 'Monospace' }}>{account}</h3>
            <Button fullWidth sx={buttonStyle} onClick={() => { deconnect(); setModalState(false); }} variant="contained"> Deconnect </Button>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: 'Monospace' }}>Not Connected</h3>
            <Button fullWidth sx={buttonStyle} onClick={() => { connect(); setModalState(false); }} variant="contained"> Connect </Button>
          </>
        )
    }
      </Box>
    </Modal>
  );
};

export default ConnectModal;
