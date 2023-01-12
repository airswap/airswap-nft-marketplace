import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';

type useContractProps = {
  abi: any;
  address: string;
  provider?: Web3Provider;
}

const useContract = ({ abi, address, provider } : useContractProps): ethers.Contract => {
  const erc721Interface = new ethers.utils.Interface(abi);
  // @ts-ignore
  const web3Provider = provider ?? new Web3Provider(window.ethereum);

  return new ethers.Contract(
    address,
    erc721Interface,
    web3Provider,
  );
};

export default useContract;
