import React from 'react';
import { useAtom } from 'jotai';
import { CircularProgress } from '@mui/material';
import { swapperContract, TTxnStatus } from '../states';
import LPTokenInfo from './LPTokenInfo';

interface ILiquidityTokens {
  reload: boolean
}

type TAddressName = [string, string];

const divStyle:React.CSSProperties = {
  fontFamily: 'Monospace',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
};

const LiquidityTokens: React.FC<ILiquidityTokens> = ({ reload }) => {
  const [swapper] = useAtom(swapperContract);

  const [txStatus, setTxStatus] = React.useState<TTxnStatus>('NOT_SUBMITED');
  const [lpTokens, setLpTokens] = React.useState<TAddressName[]>();

  const setLpTokensAndNames = async () => {
    setTxStatus('LOADING');

    try {
      const lpTokenAddresses = await swapper.getLpTokens();

      const lpTokensPromises = lpTokenAddresses.map(
        async (address):Promise<TAddressName> => [
          address,
          await swapper.getLpTokenName(address),
        ],
      );

      const lp = await Promise.all(lpTokensPromises);
      setLpTokens(lp);

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
    setLpTokensAndNames();
  }, [reload]);

  return (
    <>
      {txStatus === 'ERROR' && (
        <div style={divStyle}>
          Error getting loading information...
        </div>
      )}
      {txStatus === 'LOADING' && (
        <div style={divStyle}>
          <CircularProgress />
        </div>
      )}
      {txStatus === 'COMPLETE'
      && (
        <>
          {
            lpTokens.length === 0 ? <div style={divStyle}>No liquidity provided...</div>
              : lpTokens.map((lpToken, i) => (
                <div
                /* eslint-disable-next-line */
                key={i}
                  style={divStyle}
                >
                  {lpToken[1]}
                &nbsp;&nbsp;
                  <LPTokenInfo lpTokenAddress={lpToken[0]} />
                </div>
              ))
          }
        </>
      )}
    </>
  );
};

export default LiquidityTokens;
