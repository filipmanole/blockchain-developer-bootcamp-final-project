import React from 'react';

import { useWeb3React } from '@web3-react/core';
import { useAtom } from 'jotai';
import { Signer } from 'ethers';
import { Button, Box, Modal } from '@mui/material';
import {
  swapperContract, signerAccount, connectModalState, accountPageState,
} from '../states';
import { Swapper__factory } from '../typechain';

import SlippageSelect from './SlippageSelect';
import LiquidityTokens from './LiquidityTokens';
import AccountMenu from './AccountMenu';
import ERC20TokenInfo from './ERC20TokenInfo';

import { getTokenAddresses } from '../tokens';
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
  justifyContent: 'center',
  alignItems: 'center',
  rowGap: '10px',
};

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const ConnectModal: React.FC<IConnectModal> = () => {
  const [accountPage] = useAtom(accountPageState);
  const [modalState, setModalState] = useAtom(connectModalState);
  const [, setSwapper] = useAtom(swapperContract);
  const [, setSigner] = useAtom(signerAccount);
  const {
    active, account, library, activate, deactivate,
  } = useWeb3React();

  const connect = async () => {
    await activate(injected);
  };
  const deconnect = () => {
    deactivate();
  };

  React.useEffect(() => {
    if (active) {
      const signer = library.getSigner(account).connectUnchecked();
      setSigner(signer);
      setSwapper(
        Swapper__factory.connect(
          process.env.REACT_APP_SWAPPER_ADDRESS, signer as Signer,
        ),
      );
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
                <AccountMenu />
                {accountPage === 'main' && (
                  <>
                    <div
                      style={{
                        display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                      }}
                    >
                      <div style={{ fontFamily: 'Monospace' }}> Slippage </div>
                      <SlippageSelect />
                    </div>
                    <hr />
                    <LiquidityTokens reload={modalState} />
                    <hr />
                  </>
                )}

                {
                  accountPage === 'token' && (
                    getTokenAddresses()
                      .map((address, i) => (
                        /* eslint-disable-next-line */
                        <ERC20TokenInfo key={i} reload={modalState} tokenAddress={address} />
                      ))
                  )
                }

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
