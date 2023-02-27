/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { ADDRESS_ZERO, tokenKinds } = require('@airswap/constants');
const ethers = require('ethers');

const { abi: ERC165_ABI } = require('@openzeppelin/contracts/build/contracts/ERC165.json');
const { abi: ERC721_ABI } = require('@openzeppelin/contracts/build/contracts/ERC721.json');
const { abi: ERC1155_ABI } = require('@openzeppelin/contracts/build/contracts/ERC1155.json');

const address = process.argv[2];
const network = process.argv[3];
const apikey = process.argv[4];

/* sanity check */
if (!address || !network) console.log("Incorrect arguments...");
if (!ethers.utils.isAddress(address)) throw new Error(`Invalid address: ${address}`);

/* initialization */
let provider = !apikey ? ethers.getDefaultProvider(network) : ethers.providers.InfuraProvider.getWebSocketProvider(network, apikey);
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
    const uniqueTokenIds = tokenIds.filter((element, index) => {
      return tokenIds.indexOf(element) === index;
    });

    /* write token ids in a json file */
    fs.writeFileSync('src/constants/tokenIds.json', JSON.stringify(uniqueTokenIds));

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
    const uniqueTokenIds = tokenIds.filter((element, index) => {
      return tokenIds.indexOf(element) === index;
    });

    /* write token ids in a json file */
    fs.writeFileSync('src/constants/tokenIds.json', JSON.stringify(uniqueTokenIds));

    process.exit(0);
  });
});
