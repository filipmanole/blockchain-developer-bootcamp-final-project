import { Web3Provider } from '@ethersproject/providers';

const getWeb3 = (): Promise<Web3Provider> => new Promise((resolve, reject) => {
  window.addEventListener('load', async () => {
    if ((window as any).ethereum) {
      const web3: Web3Provider = new Web3Provider((window as any).ethereum);
      try {
        await (window as any).ethereum.send('eth_requestAccounts');
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }

    reject(new Error('No web3 provider found'));
  });
});

export default getWeb3;
