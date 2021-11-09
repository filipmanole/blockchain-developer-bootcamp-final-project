import { Signer } from 'ethers';
import { atom } from 'jotai';
import { Swapper } from './typechain';

type TTheme = 'dark' | 'light';
type TMode = 'swap' | 'pool' | 'withdraw';

export const appTheme = atom('dark' as TTheme);
export const appMode = atom('swap' as TMode);

/* Swapper contract instance */
export const swapperContract = atom(null as Swapper);

export const signerAccount = atom(null as Signer);

export const connectModalState = atom(false);
