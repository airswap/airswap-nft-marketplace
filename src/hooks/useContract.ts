import { Contract, ethers } from 'ethers';

import { getLibrary } from '../helpers/ethers';
import { useAppSelector } from '../redux/hooks';

interface useContractProps {
  abi: any;
  address: string;
}

const useContract = ({ abi, address } : useContractProps): Contract | null => {
  const erc721Interface = new ethers.utils.Interface(abi);

  const { chainId } = useAppSelector((state) => state.web3);
  if (!chainId) return null;
  const library = getLibrary(chainId);

  return new Contract(
    address,
    erc721Interface,
    library,
  );
};

export default useContract;
