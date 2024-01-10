import { BaseProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

const address = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';

const abi: ethers.ContractInterface = [{
  inputs: [{ internalType: 'contract ENS', name: '_ens', type: 'address' }],
  stateMutability: 'nonpayable',
  type: 'constructor',
}, {
  inputs: [{ internalType: 'address[]', name: 'addresses', type: 'address[]' }],
  name: 'getNames',
  outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
  stateMutability: 'view',
  type: 'function',
}];

export const getEnsNames = async (addresses: string[], provider: BaseProvider): Promise<(string | null)[]> => {
  if (provider.network.chainId !== 1) {
    return [];
  }

  const contract = new ethers.Contract(address, abi, provider);

  const responses: string[] = await contract.getNames(addresses);

  return responses.map(response => (response === '' ? null : response));
};

