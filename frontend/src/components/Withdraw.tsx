import React from 'react';
import { ethers, BigNumber } from 'ethers';
import { useAtom } from 'jotai';
import { Button, Box } from '@mui/material';
import { swapperContract } from '../states';
import { TTokenBalance } from '../types';
import HistoryModal from './HistoryModal';

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const boxStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  borderRadius: 4,
  bgcolor: 'secondary.main',
  p: 1,
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
        balance: ethers.utils.formatUnits(e.args.balance, 18),
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
          balance: ethers.utils.formatUnits(balance, 18),
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
        withdrawnList.map((log, i) => (
          <Box
            sx={boxStyle}
          /* eslint-disable-next-line */
          key={i}>
            <div>{`${log.token}`}</div>
            <div>{`${log.balance}`}</div>

          </Box>
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
