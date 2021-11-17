import { useAtom } from 'jotai';
import { ethers, BigNumber } from 'ethers';
import { AddressZero } from '@ethersproject/constants';
import { ERC20PresetMinterPauser__factory } from '../typechain';
import { signerAccount } from '../states';

export interface IUseToken {
  usable: boolean,
  expand?: (num: string) => BigNumber;
  shrink?: (num: BigNumber) => string;
  approve?: (delegate: string, amount: BigNumber) => Promise<void>;
}

const useToken = (tokenAddress: string, decimals: number = 18): IUseToken => {
  const [signer] = useAtom(signerAccount);

  if (signer === null || tokenAddress === AddressZero) {
    return { usable: false };
  }

  const token = ERC20PresetMinterPauser__factory.connect(tokenAddress, signer);

  const expand = (num: string) => ethers.utils.parseUnits(num, decimals);
  const shrink = (num: BigNumber) => ethers.utils.formatUnits(num, decimals);

  const approve = async (delegate: string, amount: BigNumber) => {
    const txn = await token.approve(delegate, amount);
    await txn.wait();
  };

  return {
    usable: true, expand, shrink, approve,
  };
};

export default useToken;
