type TTokenDictionary = { [address: string]: { name: string, symbol: string, decimals: number } };

export const TOKENS: TTokenDictionary = {
  '0xF2E246BB76DF876Cef8b38ae84130F4F55De395b': {
    name: 'DummyToken0',
    symbol: 'DT0',
    decimals: 18,
  },
  '0x2946259E0334f33A064106302415aD3391BeD384': {
    name: 'DummyToken1',
    symbol: 'DT1',
    decimals: 18,
  },
};

export const getTokenAddresses = () => Object.keys(TOKENS);
