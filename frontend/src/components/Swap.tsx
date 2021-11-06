import React from 'react';
import { Button, Box, ButtonBase } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useAtom } from 'jotai';
import { AddressZero } from '@ethersproject/constants';
import { CustomInput } from './CustomInput';
import { swapperContract } from '../states';
import IToken from '../types/IToken';
import useToken from '../hooks/useToken';

import './SwapPool.css';

export interface ISwap {
}

enum SwapState {
  NO_INPUT_OUTPUT,
  EXACT_INPUT,
  EXACT_OUTPUT,
}

const tokens: IToken[] = [
  {
    name: 'DummyToken0',
    symbol: 'DT0',
    address: '0xF2E246BB76DF876Cef8b38ae84130F4F55De395b',
  },
  {
    name: 'DummyToken1',
    symbol: 'DT1',
    address: '0x2946259E0334f33A064106302415aD3391BeD384',
  },
];

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
  padding: '4px',

  boxShadow: 0,
  zIndex: 2,
};

const defaultToken: IToken = {
  name: '',
  symbol: '',
  address: AddressZero,
};

const Swap: React.FC<ISwap> = () => {
  const [state, setState] = React.useState(SwapState.NO_INPUT_OUTPUT);

  const [token0, setToken0] = React.useState(defaultToken);
  const [token1, setToken1] = React.useState(defaultToken);

  const [amount0, setAmount0] = React.useState('');
  const [amount1, setAmount1] = React.useState('');

  const useToken0 = useToken(token0.address);
  const useToken1 = useToken(token1.address);

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
    if (token0.address === AddressZero) return true;
    if (token1.address === AddressZero) return true;

    return false;
  };

  const amountNotEntered = (): boolean => {
    if (amount0 === '' && amount1 === '') return true;

    return false;
  };

  const swap = () => {
    console.log(useToken0, useToken1, swapper, state);
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

  return (
    <div id="swap-pool-window">
      <div id="swap-pool-inputs">
        <CustomInput
          tokens={tokens}
          token={token0}
          amount={amount0}
          setToken={setToken0}
          setAmount={setAmount0}
          onInputChange={onAmount0Change}
        />
        <CustomInput
          tokens={tokens}
          token={token1}
          amount={amount1}
          setToken={setToken1}
          setAmount={setAmount1}
          onInputChange={onAmount1Change}
        />
        <Box sx={arrowStyle}>
          <ButtonBase onClick={switchInputs}>
            <ArrowDownwardIcon sx={{ fill: 'white' }} />
          </ButtonBase>
        </Box>
      </div>

      <div>
        <Button disabled={tokensNotSelected() || amountNotEntered()} onClick={swap} sx={button} fullWidth variant="contained">
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default Swap;
