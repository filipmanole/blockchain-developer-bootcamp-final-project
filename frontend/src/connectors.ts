import { InjectedConnector } from '@web3-react/injected-connector';

const injected = new InjectedConnector({ supportedChainIds: [4, 1337] });

export default injected;
