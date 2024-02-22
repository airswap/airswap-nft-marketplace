import truncateEthAddress from 'truncate-eth-address';

import useEnsAddress from './useEnsAddress';

const useAddressOrEnsName = (address?: string, shouldTruncate = false) => {
  const fallback = (shouldTruncate && address) ? truncateEthAddress(address) : address;

  const ensAddress = useEnsAddress(address);

  return ensAddress || fallback;
};

export default useAddressOrEnsName;
