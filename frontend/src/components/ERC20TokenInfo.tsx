import React from 'react';

import { useAtom } from 'jotai';
import { Button, CircularProgress } from '@mui/material';
import { BigNumber, Signer, ethers } from 'ethers';
import { getSymbol, getDecimals } from '../tokens';
import { DummyToken__factory } from '../typechain';
import { TTxnStatus, signerAccount } from '../states';

interface IERC20TokenInfo {
  reload: boolean;
  tokenAddress: string;
}

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const divStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  alignItems: 'center',
  fontFamily: 'Monospace',
};

const ERC20TokenInfo: React.FC<IERC20TokenInfo> = ({ reload, tokenAddress }) => {
  const [signer] = useAtom(signerAccount);

  const [txStatus, setTxStatus] = React.useState<TTxnStatus>('NOT_SUBMITED');
  const [minted, setMinted] = React.useState<boolean>();
  const [balance, setBalance] = React.useState<BigNumber>(BigNumber.from(0));

  const loadDetails = async () => {
    const token = DummyToken__factory.connect(tokenAddress, signer as Signer);
    setTxStatus('LOADING');

    try {
      setBalance(await token.balanceOf(await signer.getAddress()));
      setMinted(await token.getStatus());

      setTxStatus('COMPLETE');
    } catch (err) {
      setTxStatus('ERROR');
    }
  };

  const mint = async () => {
    if (minted === true) return;

    const token = DummyToken__factory.connect(tokenAddress, signer as Signer);
    setTxStatus('LOADING');

    try {
      const tx = await token.mintOnlyOnce();
      await tx.wait();

      setTxStatus('COMPLETE');
    } catch (err) {
      setTxStatus('ERROR');
    }
  };

  React.useEffect(() => {
    if (!reload) {
      setTxStatus('NOT_SUBMITED');
      return;
    }

    loadDetails();
  }, [reload]);

  return (
    <div style={divStyle}>
      <div>{getSymbol(tokenAddress)}</div>
      {txStatus === 'ERROR' && <div>Transaction Error</div>}
      {txStatus === 'LOADING' && <CircularProgress />}
      {txStatus === 'COMPLETE'
        && (
        <>
          <div>{ethers.utils.formatUnits(balance, getDecimals(tokenAddress))}</div>
          {
            minted
              ? <Button sx={buttonStyle} disabled variant="contained">Minted</Button>
              : <Button sx={buttonStyle} variant="contained" onClick={async () => { await mint(); loadDetails(); }}>Mint now</Button>
          }
        </>
        )}

    </div>
  );
};

export default ERC20TokenInfo;
