import { atom } from 'jotai';

type TTheme = 'dark' | 'light';
type TMode = 'swap' | 'pool' | 'withdraw';

export const appTheme = atom('dark' as TTheme);
export const appMode = atom('swap' as TMode);
