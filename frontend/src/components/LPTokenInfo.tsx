import * as React from 'react';
import Popover from '@mui/material/Popover';
import {
  Paper, Button, CircularProgress, IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useAtom } from 'jotai';
import { BigNumber, ethers } from 'ethers';
import { IUniswapV2Pair__factory } from '../typechain';
import { getSymbol, getDecimals } from '../tokens';

import { swapperContract, signerAccount, TTxnStatus } from '../states';

interface ILPTokenInfo{
  lpTokenAddress: string;
}

const buttonStyle = {
  borderRadius: '13px',
  fontFamily: 'Monospace',
  fontSize: '20px',
  fontWeight: 'bold',
};

const LPTokenInfo: React.FC<ILPTokenInfo> = ({ lpTokenAddress }) => {
  const [signer] = useAtom(signerAccount);
  const [swapper] = useAtom(swapperContract);
  const [txStatus, setTxStatus] = React.useState<TTxnStatus>('NOT_SUBMITED');

  const lpToken = IUniswapV2Pair__factory.connect(lpTokenAddress, signer);
  const [lpBalance, setLpBalance] = React.useState<BigNumber>(BigNumber.from(0));
  const [lpBalanceToRemove, setLpBalanceToRemove] = React.useState<BigNumber>(BigNumber.from(0));

  const [token0, setToken0] = React.useState<string>();
  const [token1, setToken1] = React.useState<string>();

  const [amount0, setAmount0] = React.useState<BigNumber>(BigNumber.from(0));
  const [amount1, setAmount1] = React.useState<BigNumber>(BigNumber.from(0));

  const [enteredAmount, setEnteredAmount] = React.useState<string>('');

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setTxStatus('NOT_SUBMITED');
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const init = async () => {
    setTxStatus('LOADING');
    setToken0(await lpToken.token0());
    setToken1(await lpToken.token1());
    // setTxStatus('COMPLETE');
  };

  const setBalance = async () => {
    setTxStatus('LOADING');
    const accountAddress = await signer.getAddress();
    const balance = await lpToken.balanceOf(accountAddress);
    setLpBalance(balance);
    setLpBalanceToRemove(balance);
    // setTxStatus('COMPLETE');
  };

  const setAmounts = async (amount) => {
    setTxStatus('LOADING');
    const [a0, a1] = await swapper.computeLiquidityShareValue(lpToken.address, amount);
    setAmount0(a0);
    setAmount1(a1);
    setTxStatus('COMPLETE');
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    if (open) setBalance();
  }, [open]);

  React.useEffect(() => {
    if (open) setAmounts(lpBalanceToRemove);
  }, [lpBalanceToRemove]);

  /* eslint-disable-next-line */
  const isNumeric = (str:string): boolean => !isNaN(str as unknown as number) && !isNaN(parseFloat(str));

  return (
    <div>
      <IconButton onClick={handleClick}><InfoIcon /></IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div>
          <div
            style={{
              padding: '10px',
              display: 'grid',
              gridAutoRows: 'auto',
              justifyItems: 'center',
              rowGap: '10px',
            }}
          >
            <Paper sx={{
              borderRadius: '13px',
              fontFamily: 'Monospace',
              width: '300px',
              height: '100px',
              display: 'grid',
              gridAutoRows: 'auto',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            >
              {txStatus === 'LOADING' && <CircularProgress />}
              {txStatus === 'COMPLETE' && (
              <>
                <div>{`Balance: ${ethers.utils.formatUnits(lpBalance, 18)}`}</div>
                <div>{`${getSymbol(token0)}: ${ethers.utils.formatUnits(amount0, getDecimals(token0))}`}</div>
                <div>{`${getSymbol(token1)}: ${ethers.utils.formatUnits(amount1, getDecimals(token1))}`}</div>
              </>
              )}
            </Paper>
            <input
              style={{
                padding: '5px',
                borderRadius: '10px',
                width: '100%',
                fontFamily: 'Monospace',
                fontSize: '20px',
                fontWeight: 'bold',
                textAlign: 'right',
              }}
              autoComplete="off"
              // id="amount-input"
              value={enteredAmount}
              placeholder="0.0"
              onChange={(e) => {
                if (e.target.value === '') { setEnteredAmount(''); setLpBalanceToRemove(ethers.utils.parseUnits('0.0')); }
                if (isNumeric(e.target.value)) {
                  setEnteredAmount(e.target.value);
                  setLpBalanceToRemove(ethers.utils.parseUnits(e.target.value));
                }
              }}
            />
            <Button
              sx={buttonStyle}
              fullWidth
              variant="outlined"
            >
              Remove
            </Button>
          </div>

        </div>
      </Popover>
    </div>
  );
};

export default LPTokenInfo;
