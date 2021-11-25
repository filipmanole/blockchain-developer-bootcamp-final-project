import React from 'react';
import { useAtom } from 'jotai';
import { CircularProgress } from '@mui/material';
import { swapperContract, TTxnStatus } from '../states';
import LPTokenInfo from './LPTokenInfo';

interface ILiquidityTokens {
  reload: boolean
}

type TAddressName = [string, string];

const LiquidityTokens: React.FC<ILiquidityTokens> = ({ reload }) => {
  const [swapper] = useAtom(swapperContract);

  const [txStatus, setTxStatus] = React.useState<TTxnStatus>('NOT_SUBMITED');
  const [lpTokens, setLpTokens] = React.useState<TAddressName[]>();

  const setLpTokensAndNames = async () => {
    setTxStatus('LOADING');

    const lpTokenAddresses = await swapper.getLpTokens();

    const lpTokensPromises = lpTokenAddresses.map(
      async (address):Promise<TAddressName> => [
        address,
        await swapper.getLpTokenNames(address),
      ],
    );

    const lp = await Promise.all(lpTokensPromises);
    setLpTokens(lp);

    setTxStatus('COMPLETE');
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
      {txStatus === 'LOADING' && <CircularProgress />}
      {txStatus === 'COMPLETE'
      && (
        <>
          {
            lpTokens.map((lpToken, i) => (
              <div
                /* eslint-disable-next-line */
                key={i}
                style={{
                  fontFamily: 'Monospace',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
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
