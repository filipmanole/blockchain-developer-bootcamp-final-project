import React from 'react';
import { Button } from '@mui/material';
import { useAtom } from 'jotai';
import { AddressZero } from '@ethersproject/constants';
import { CustomInput } from './CustomInput';
import { swapperContract } from '../states';
import useToken from '../hooks/useToken';

import { TOKENS } from '../tokens';

import './SwapPool.css';

export interface IPool {
}

const tokens = Object.keys(TOKENS);

const button = {
  borderRadius: 3,
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const Pool: React.FC<IPool> = () => {
  const [token0, setToken0] = React.useState(AddressZero);
  const [token1, setToken1] = React.useState(AddressZero);

  const [amount0, setAmount0] = React.useState('');
  const [amount1, setAmount1] = React.useState('');

  const useToken0 = useToken(token0);
  const useToken1 = useToken(token1);

  const [swapper] = useAtom(swapperContract);

  const inputsNotEntered = ():boolean => {
    if (token0 === AddressZero) return true;
    if (amount0 === '') return true;

    if (token1 === AddressZero) return true;
    if (amount1 === '') return true;

    return false;
  };

  const addLiquidity = async () => {
    const amountToken0 = useToken0.expand(amount0);
    const amountToken1 = useToken1.expand(amount1);

    try {
      await useToken0.approve(swapper.address, amountToken0);
      await useToken1.approve(swapper.address, amountToken1);

      const txn = await swapper.addLiquidity(
        token0,
        amountToken0,
        token1,
        amountToken1,
      );
      await txn.wait();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="swap-pool-window">
      <div id="swap-pool-inputs">
        <CustomInput
          tokens={tokens.filter(
            (token) => token !== token0 && token !== token1,
          )}
          token={token0}
          amount={amount0}
          setToken={setToken0}
          setAmount={setAmount0}
        />
        <CustomInput
          tokens={tokens.filter(
            (token) => token !== token0 && token !== token1,
          )}
          token={token1}
          amount={amount1}
          setToken={setToken1}
          setAmount={setAmount1}
        />
      </div>

      <div>
        <Button disabled={inputsNotEntered()} onClick={addLiquidity} sx={button} fullWidth variant="contained">
          ADD LIQUIDITY
        </Button>
      </div>
    </div>
  );
};

export default Pool;
