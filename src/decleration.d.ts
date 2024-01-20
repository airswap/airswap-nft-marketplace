import { Alchemy } from 'alchemy-sdk';

declare global {
  interface Window {
    ethereum: any;
    alchemy: Alchemy;
  }

  const alchemy: typeof alchemy;
}
