export enum AppRoutes {
  collection = 'collection',
  listNft = 'list-nft',
  nftDetail = 'nft-detail',
  orderDetail = 'order-detail',
  profile = 'profile',
  swap = 'swap',
}

export enum ProfileRoutes {
  activity = 'activity',
  orders = 'orders',
  ownedNfts = 'owned-nfts',
}

export const routes = {
  collection: () => '/',
  listNft: (tokenId?: string) => `/${AppRoutes.listNft}${tokenId ? `?tokenId=${tokenId}` : ''}`,
  nftDetail: (tokenId: string) => `/${AppRoutes.nftDetail}/${tokenId}`,
  orderDetail: (account: string, orderNonce: string) => `/${AppRoutes.orderDetail}/${account}/${orderNonce}`,
  profile: (account: string) => `/${AppRoutes.profile}/${account}/${ProfileRoutes.ownedNfts}`,
  userOrders: (account: string) => `/${AppRoutes.profile}/${account}/${ProfileRoutes.orders}`,
  activity: (account: string) => `/${AppRoutes.profile}/${account}/${ProfileRoutes.activity}`,
};
