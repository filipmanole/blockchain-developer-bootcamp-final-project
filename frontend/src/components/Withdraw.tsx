import React from 'react';
import { useAtom } from 'jotai';
import { BigNumber } from 'ethers';
import { Button } from '@mui/material';
import { swapperContract } from '../states';
import { TTokenBalance } from '../types';
import HistoryModal from './HistoryModal';

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const Withdraw = () => {
  const [swapper] = useAtom(swapperContract);
  const [withdrawnList, setWithdrawnList] = React.useState([] as TTokenBalance[]);
  const [history, setHistory] = React.useState([] as TTokenBalance[]);
  const [historyModalState, setHistoryModalState] = React.useState(false);

  React.useEffect(() => {
    if (historyModalState !== true) return;
    const withdrawFilter = swapper.filters.Withdrawn(null, null);

    swapper.queryFilter(withdrawFilter).then((events) => {
      setHistory(events.map((e) => ({
        token: e.args.token,
        balance: e.args.balance.toString(),
      })));
    });
  }, [historyModalState]);

  React.useEffect(() => {
    const withdrawFilter = swapper.filters.Withdrawn(null, null);
    swapper.on(withdrawFilter, (token: string, balance: BigNumber) => {
      setWithdrawnList((ok) => [
        ...ok,
        {
          token,
          balance: balance.toString(),
        },
      ]);
    });
  }, []);

  const withdraw = () => {
    swapper.withdraw();
  };

  return (
    <>
      {
        withdrawnList.map((e, i) => (
          <div
            /* eslint-disable-next-line */
            key={i}
          >
            {`${e.token} ${e.balance.toString()}`}
          </div>
        ))
      }
      <Button
        sx={buttonStyle}
        variant="contained"
        fullWidth
        onClick={() => withdraw()}
      >
        Withdraw
      </Button>
      <Button
        sx={buttonStyle}
        variant="contained"
        fullWidth
        onClick={() => setHistoryModalState(true)}
      >
        History
      </Button>
      <HistoryModal
        open={historyModalState}
        onClose={() => setHistoryModalState(false)}
        history={history}
      />
    </>
  );
};

export default Withdraw;
