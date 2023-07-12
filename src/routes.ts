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
  listNft: () => `/${AppRoutes.listNft}`,
  nftDetail: (tokenId: number) => `/${AppRoutes.nftDetail}/${tokenId}`,
  orderDetail: (account: string, orderNonce: string) => `/${AppRoutes.orderDetail}/${account}/${orderNonce}`,
  profile: (account: string) => `/${AppRoutes.profile}/${account}/${ProfileRoutes.ownedNfts}`,
  userOrders: (account: string) => `/${AppRoutes.profile}/${account}/${ProfileRoutes.orders}`,
  activity: (account: string) => `/${AppRoutes.profile}/${account}/${ProfileRoutes.activity}`,
};
