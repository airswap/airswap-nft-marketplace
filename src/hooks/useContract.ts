import { Contract, ethers } from 'ethers';

import { store } from '../redux/store';

interface useContractProps {
  abi: ConstructorParameters<typeof ethers.utils.Interface>[0];
  address: string;
}

const useContract = ({ abi, address }: useContractProps): Contract | null => {
  const erc721Interface = new ethers.utils.Interface(abi);
  const { web3, library: libraryState } = store.getState();

  const { chainId } = web3;
  if (!chainId) return null;

  const { library } = libraryState;
  if (!library) return null;

  return new Contract(address, erc721Interface, library[chainId]);
};

export default useContract;
