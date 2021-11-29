type TTokenDictionary = { [address: string]: { name: string, symbol: string, decimals: number } };

export const TOKENS: TTokenDictionary = {
  '0xB83A3DCeBF2ced779682Ce04a1fc1DeFf7F5D314': {
    name: 'DummyToken0',
    symbol: 'DT0',
    decimals: 18,
  },
  '0x87Df8c8d5115f2F1D432eC65f935Ab1383dd9b8C': {
    name: 'DummyToken1',
    symbol: 'DT1',
    decimals: 18,
  },
};

export const getName = (address: string) => TOKENS[address].name;
export const getSymbol = (address : string) => TOKENS[address].symbol;
export const getDecimals = (address:string) => TOKENS[address].decimals;

export const getTokenAddresses = () => Object.keys(TOKENS);
