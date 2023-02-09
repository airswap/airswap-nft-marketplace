import { getTokenFromContract } from '@airswap/metadata';
import { TokenInfo } from '@airswap/typescript';
import { Web3Provider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';

// import { TokenMeta } from './nftDetailSlice';

interface fetchNftMetaParams {
  library: Web3Provider;
  collectionToken: string;
  tokenId: string;
}

export const fetchNftMeta = createAsyncThunk<
TokenInfo, fetchNftMetaParams>(
  'nftDetail/fetchNftMeta',
  async ({
    library, collectionToken, tokenId,
  }) => {
    let tokenInfo: TokenInfo;
    try {
      tokenInfo = await getTokenFromContract(library, collectionToken, tokenId.toString());
    } catch (e) {
      throw new Error(`Unable to fetch data for ${collectionToken} with id ${tokenId}`);
    }

    console.log(tokenInfo);

    return tokenInfo;

    // token.price = '0154541201556702705';
    // token.image = token.image.replace('ipfs://', process.env.REACT_APP_IPFS_GATEWAY_URL as string);

    // return token as TokenMeta;
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
