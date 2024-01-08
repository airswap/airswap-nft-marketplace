import { useEffect, useMemo, useState } from 'react';

import { Web3Provider } from '@ethersproject/providers';

import { Address, EnsAddresses } from '../entities/Address/Address';
import { transformToAddress } from '../entities/Address/AddressTransformers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { addEnsAddresses } from '../redux/stores/metadata/metadataActions';
import useWeb3ReactLibrary from './useWeb3ReactLibrary';

const useEnsAddresses = (addresses: string[]): Address[] => {
  const dispatch = useAppDispatch();
  const { library } = useWeb3ReactLibrary();

  const { ensAddresses } = useAppSelector(state => state.metadata);

  const [newAddresses, setNewAddresses] = useState<string[]>([]);

  useEffect(() => {
    const allAddresses = [...Object.keys(ensAddresses), ...newAddresses];

    setNewAddresses(addresses.filter(address => !allAddresses.includes(address)));
  }, [addresses]);

  useEffect(() => {
    if (!library || !newAddresses.length) {
      return;
    }

    const lookupAddresses = async (provider: Web3Provider, values: string[]) => {
      try {
        // Note: lookupAddress only seems to work on mainnet.
        const responses = await Promise.all(
          values.map(value => provider.lookupAddress(value)),
        );

        const newEnsAddresses: EnsAddresses = responses.reduce((acc, response, index) => ({
          ...acc,
          [values[index]]: response,
        }), {});

        dispatch(addEnsAddresses(newEnsAddresses));
      } catch (e) {
        console.error(e);
      }
    };

    lookupAddresses(library, newAddresses);
  }, [library, newAddresses]);

  return useMemo(() => ([...Object.keys(ensAddresses), ...newAddresses]
    .map(address => transformToAddress(address, ensAddresses[address], ensAddresses[address] === undefined))
  ), [newAddresses, ensAddresses]);
};

export default useEnsAddresses;
