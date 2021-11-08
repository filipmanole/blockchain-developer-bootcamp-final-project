import { useAtom } from 'jotai';
import { BigNumber } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import { ERC20PresetMinterPauser__factory } from '../typechain';
import { signerAccount } from '../states';

export interface IUseToken {
  usable: boolean,
  expand?: (num: number) => BigNumber;
  shrink?: (num: BigNumber) => string;
  approve?: (delegate: string, amount: BigNumber) => Promise<void>;
}

const useToken = (tokenAddress: string, decimals: number = 18): IUseToken => {
  const [signer] = useAtom(signerAccount);

  if (signer === null || tokenAddress === AddressZero) {
    return { usable: false };
  }

  const token = ERC20PresetMinterPauser__factory.connect(tokenAddress, signer);

  const expand = (num: number) => BigNumber.from(num).mul(BigNumber.from(10).pow(decimals));
  const shrink = (num: BigNumber) => num.div(BigNumber.from(10).pow(decimals)).toString();

  const approve = async (delegate: string, amount: BigNumber) => {
    const txn = await token.approve(delegate, amount);
    await txn.wait();
  };

  return {
    usable: true, expand, shrink, approve,
  };
};

export default useToken;
