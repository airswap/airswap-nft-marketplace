import { initializeConnector } from '@web3-react/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { MetaMask } from '@web3-react/metamask';

export const [metaMask, hooks] = initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));
