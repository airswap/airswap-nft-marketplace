export interface CollectionTokenEvent {
  type: 'swap';
  timestamp: number;
  from: string;
  to: string;
  tokenId: number;
}
