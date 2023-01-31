import ERC721 from '@openzeppelin/contracts/build/contracts/ERC721.json';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { getLibrary } from '../../../helpers/ethers';
import { store } from '../../store';
import { getCollectionErc721Contract } from '../collection/collectionApi';
import { addEventLog, EventLog } from './tokenSlice';

const tokenInterface: ethers.utils.Interface = new ethers.utils.Interface(
  JSON.stringify(ERC721.abi),
);


export const fetchNFTActivity = createAsyncThunk(
  'token/fetchNFTActivity',
  async () => {
    const { token, web3, config } = store.getState();
    if (!web3.chainId) return;
    const library = getLibrary(web3.chainId);
    const contract = getCollectionErc721Contract(library, config.collectionToken);
    if (!contract) return;
    try {
      const events = await contract.queryFilter('Transfer');
      events.forEach((rawLog: ethers.Event) => {
        const logDescription: ethers.utils.LogDescription = tokenInterface.parseLog(rawLog);
        if (!logDescription) return;
        const tokenId: number = logDescription.args[2].toNumber();
        if (token.selectedTokenId === tokenId) {
          console.log('Foind a match!!', logDescription, tokenId);
          const transfer: EventLog = {
            to: logDescription.args.to,
            from: logDescription.args.from,
            tokenId: logDescription.args.tokenId.toNumber(),
            type: logDescription.name,
          };
          store.dispatch(addEventLog(transfer));
        }
      });
    } catch (err) {
      // TODO
      console.log('contract.filters.Transfer CATCH', err);
    }


    // try {
    //   const contract = getCollectionContract();
    //   if (!contract) return;
    //   contract.on('Transfer', (from, to, tokenId, event) => {
    //     console.log('Transfer Event:', from, to, tokenId, event);
    //   });
    // } catch (err) {
    //   // TODO
    //   console.log('contract.on Transfer CATCH', err);
    // }
  },
);
