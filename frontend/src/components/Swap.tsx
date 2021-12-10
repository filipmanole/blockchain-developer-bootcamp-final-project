/* eslint-disable */
import React from 'react';
import { Button, Box, ButtonBase } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useAtom } from 'jotai';
import { AddressZero } from '@ethersproject/constants';
import { CustomInput } from './CustomInput';
import { swapperContract, transactionStatus, transactionMessage } from '../states';
import useToken from '../hooks/useToken';

import { getTokenAddresses } from '../tokens';

import './SwapPool.css';

export interface ISwap {
}

enum SwapState {
  NO_INPUT_OUTPUT,
  EXACT_INPUT,
  EXACT_OUTPUT,
}

const tokens = getTokenAddresses();

const button = {
  borderRadius: 3,
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const arrowStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  bgcolor: 'primary.main',
  border: '6px solid',
  borderRadius: '13px',
  borderColor: 'background.paper',

  display: 'flex',
  justifyContent: 'center',

  boxShadow: 0,
  zIndex: 2,
};

const Swap: React.FC<ISwap> = () => {
  const [, setTxStatus] = useAtom(transactionStatus);
  const [, setTxMessage] = useAtom(transactionMessage);

  const [errInput, setErrInput] = React.useState<boolean>(false);

  const [state, setState] = React.useState(SwapState.NO_INPUT_OUTPUT);

  const [token0, setToken0] = React.useState(AddressZero);
  const [token1, setToken1] = React.useState(AddressZero);

  const [amount0, setAmount0] = React.useState('');
  const [amount1, setAmount1] = React.useState('');

  const tokenIn = useToken(token0);
  const tokenOut = useToken(token1);

  const [swapper] = useAtom(swapperContract);

  const switchInputs = () => {
    if (state === SwapState.NO_INPUT_OUTPUT) {
      const auxToken = token0;
      setToken0(token1);
      setToken1(auxToken);
    }

    if (state === SwapState.EXACT_INPUT) {
      const auxToken = token1;

      setToken1(token0);
      setAmount1(amount0);

      setToken0(auxToken);
      setAmount0('');

      setState(SwapState.EXACT_OUTPUT);
    }

    if (state === SwapState.EXACT_OUTPUT) {
      const auxToken = token0;

      setToken0(token1);
      setAmount0(amount1);

      setToken1(auxToken);
      setAmount1('');

      setState(SwapState.EXACT_INPUT);
    }
  };

  const tokensNotSelected = ():boolean => {
    if (token0 === AddressZero) return true;
    if (token1 === AddressZero) return true;

    return false;
  };

  const amountNotEntered = (): boolean => {
    if (amount0 === '' && amount1 === '') return true;

    return false;
  };

  const swap = async () => {
    if (!tokenIn.usable || !tokenOut.usable) return;

    const amountIn = tokenIn.expand(amount0);
    const amountOut = tokenOut.expand(amount1);
    await tokenIn.approve(swapper.address, amountIn);

    /* Add try catch */
    try {
      setTxMessage('Swapping tokens');
      setTxStatus('LOADING');
      if (state === SwapState.EXACT_INPUT) {
        const tx = await swapper.swapExactTokensIn(
          token0, token1, amountIn, amountOut,
        );
        await tx.wait();
      } else if (state === SwapState.EXACT_OUTPUT) {
        const tx = await swapper.swapExactTokensOut(
          token0, token1, amountIn, amountOut,
        );
        await tx.wait();
      } else {
        throw new Error('Could not perform swap...');
      }
      setTxStatus('COMPLETE');
    } catch (err) {
      setTxMessage('Error while swapping tokens');
      setTxStatus('ERROR');
    }
  };

  const getButtonText = (): string => {
    if (tokensNotSelected()) return 'SELECT TOKENS';
    if (amountNotEntered()) return 'ENTER AMOUNTS';

    return 'SWAP';
  };

  const onAmount0Change = () => {
    setAmount1('');
    setState(SwapState.EXACT_INPUT);
  };

  const onAmount1Change = () => {
    setAmount0('');
    setState(SwapState.EXACT_OUTPUT);
  };

  React.useEffect(() => {
    if (amountNotEntered()) setState(SwapState.NO_INPUT_OUTPUT);
  }, [amount0, amount1]);

  React.useEffect(() => {
    if (!tokenIn.usable || !tokenOut.usable) return;
    if (state !== SwapState.EXACT_INPUT) return;
    if (amount0 === '') { setErrInput(false); return; }

    const amountIn = tokenIn.expand(amount0);
    const path: string[] = [token0, token1];
    swapper.getAmountsOut(amountIn, path)
      .then((amounts) => {
        setErrInput(false);
        setAmount1(tokenOut.shrink(amounts[1]));
      })
      .catch(() => { setErrInput(true); });
  }, [amount0]);

  React.useEffect(() => {
    if (!tokenIn.usable || !tokenOut.usable) return;
    if (state !== SwapState.EXACT_OUTPUT) return;
    if (amount1 === '') { setErrInput(false); return; }

    const amountOut = tokenOut.expand(amount1);
    const path: string[] = [token0, token1];
    swapper.getAmountsIn(amountOut, path)
      .then((amounts) => {
        setErrInput(false);
        setAmount0(tokenOut.shrink(amounts[0]));
      })
      .catch(() => { setErrInput(true); });
  }, [amount1]);

  return (
    <div id="swap-pool-window">
      <div id="swap-pool-inputs">
        <CustomInput
          badInput={errInput}
          tokens={
            tokens.filter(
              (token) => token !== token0 && token !== token1,
            )
          }
          token={token0}
          amount={amount0}
          setToken={setToken0}
          setAmount={setAmount0}
          onInputChange={onAmount0Change}
        />
        <CustomInput
          badInput={errInput}
          tokens={
            tokens.filter(
              (token) => token !== token0 && token !== token1,
            )
          }
          token={token1}
          amount={amount1}
          setToken={setToken1}
          setAmount={setAmount1}
          onInputChange={onAmount1Change}
        />
        <Box sx={arrowStyle}>
          <ButtonBase
            sx={{ borderRadius: '13px', padding: '4px' }}
            onClick={switchInputs}
          >
            <ArrowDownwardIcon sx={{ fill: 'white' }} />
          </ButtonBase>
        </Box>
      </div>

      <div>
        <Button
          disabled={errInput || tokensNotSelected() || amountNotEntered()}
          onClick={swap}
          sx={button}
          fullWidth
          variant="contained"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default Swap;
