import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getCollectionErc721Contract } from '../collection/collectionApi';
import { TokenMeta } from './nftDetailSlice';

interface fetchNftMetaParams {
  library: Web3Provider;
  collectionToken: string;
  tokenId: string;
}

export const fetchNftMeta = createAsyncThunk<
TokenMeta, fetchNftMetaParams>(
  'nftDetail/fetchNftMeta',
  async ({
    library, collectionToken, tokenId,
  }) => {
    // TODO: Add support for ERC-1155
    const collectionContract = getCollectionErc721Contract(library, collectionToken);
    if (!collectionContract) {
      throw new Error('No collection contract found');
    }

    const tokenURI = await collectionContract.tokenURI(tokenId);
    const res = await fetch(
      tokenURI.replace('ipfs://', process.env.REACT_APP_IPFS_GATEWAY_URL),
    );
    const token = await res.json() as TokenMeta;

    token.price = '0154541201556702705';
    token.image = token.image.replace('ipfs://', process.env.REACT_APP_IPFS_GATEWAY_URL as string);

    return token as TokenMeta;
  },
);


// const tokenInterface: ethers.utils.Interface = new ethers.utils.Interface(
//   JSON.stringify(ERC721.abi),
// );

// export const fetchNFTActivity = createAsyncThunk(
//   'nftDetail/fetchNFTActivity',
//   async () => {
//     const { token, web3, config } = store.getState();
//     if (!web3.chainId) return;
//     const library = getLibrary(web3.chainId);
//     const contract = getCollectionErc721Contract(library, config.collectionToken);
//     if (!contract) return;
//     try {
//       const events = await contract.queryFilter('Transfer');
//       events.forEach((rawLog: ethers.Event) => {
//         const logDescription: ethers.utils.LogDescription = tokenInterface.parseLog(rawLog);
//         if (!logDescription) return;
//         const tokenId: number = logDescription.args[2].toNumber();
//         if (parseInt(token.selectedTokenId || '0', 10) === tokenId) {
//           const transfer: EventLog = {
//             to: logDescription.args.to,
//             from: logDescription.args.from,
//             tokenId: logDescription.args.tokenId.toNumber(),
//             type: logDescription.name,
//           };
//           store.dispatch(addEventLog(transfer));
//         }
//       });
//     } catch (err) {
//       // TODO
//       console.log('contract.filters.Transfer CATCH', err);
//     }

//     // TODO: Continue working on getting recent NFT activity
//     // try {
//     //   const contract = getCollectionContract();
//     //   if (!contract) return;
//     //   contract.on('Transfer', (from, to, tokenId, event) => {
//     //     console.log('Transfer Event:', from, to, tokenId, event);
//     //   });
//     // } catch (err) {
//     //   // TODO
//     //   console.log('contract.on Transfer CATCH', err);
//     // }
//   },
// );
