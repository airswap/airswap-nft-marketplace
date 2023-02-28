/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const ethers = require('ethers');
const dotenv = require('dotenv');

const { ADDRESS_ZERO, tokenKinds } = require('@airswap/constants');

const { abi: ERC165_ABI } = require('@openzeppelin/contracts/build/contracts/ERC165.json');
const { abi: ERC721_ABI } = require('@openzeppelin/contracts/build/contracts/ERC721.json');
const { abi: ERC1155_ABI } = require('@openzeppelin/contracts/build/contracts/ERC1155.json');

/* load env variables */
dotenv.config();

const address = process.env.REACT_APP_COLLECTION_TOKEN;
const network = ethers.providers.getNetwork(process.env.REACT_APP_CHAIN_ID);
const apikey = process.env.REACT_APP_INFURA_API_KEY;

/* check address */
if (!ethers.utils.isAddress(address)) throw new Error(`Invalid address: ${address}`);

/* initialization */
const provider = !apikey ? ethers.getDefaultProvider(network) : ethers.providers.InfuraProvider.getWebSocketProvider(network, apikey);
const contract = new ethers.Contract(address, ERC165_ABI, provider);

/* if contract is ERC721 */
contract.supportsInterface(tokenKinds.ERC721).then((isERC721) => {
  if (!isERC721) return;

  const collectionContract = new ethers.Contract(address, ERC721_ABI, provider);
  const transferFilter = collectionContract.filters.Transfer(ADDRESS_ZERO);

  collectionContract.queryFilter(transferFilter, 0).then(events => {
    /* get token ids from past events */
    const tokenIds = events.map(e => e.args?.at(2).toString());

    /* get unique values */
    const uniqueTokenIds = tokenIds.filter((element, index) => tokenIds.indexOf(element) === index);

    const objToWrite = {
      address,
      ids: uniqueTokenIds,
      length: uniqueTokenIds.length,
    };

    /* write token ids in a json file */
    fs.writeFileSync('src/constants/tokenIds.json', JSON.stringify(objToWrite, null, 2));

    process.exit(0);
  });
});

/* if contract is ERC1155 */
contract.supportsInterface(tokenKinds.ERC1155).then((isERC1155) => {
  if (!isERC1155) return;

  const collectionContract = new ethers.Contract(address, ERC1155_ABI, provider);
  const transferFilter = collectionContract.filters.TransferSingle(null, ADDRESS_ZERO);

  collectionContract.queryFilter(transferFilter, 0).then(events => {
    /* get token ids from past events */
    const tokenIds = events.map(e => e.args?.at(3).toString());

    /* get unique values */
    const uniqueTokenIds = tokenIds.filter((element, index) => tokenIds.indexOf(element) === index);

    const objToWrite = {
      address,
      ids: uniqueTokenIds,
      length: uniqueTokenIds.length,
    };

    /* write token ids in a json file */
    fs.writeFileSync('src/constants/tokenIds.json', JSON.stringify(objToWrite, null, 2));

    process.exit(0);
  });
});
