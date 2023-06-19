import React, { FC } from 'react';

import { createHashRouter, Navigate, RouterProvider } from 'react-router-dom';

import {
  BuyNftPage,
  CollectionPage,
  ListNftPage,
  NftDetailPage,
  ProfileOrdersPage,
  ProfilePage,
} from '../../pages';
import { AppRoutes, ProfileRoutes } from '../../routes';

const Routes: FC = () => {
  const router = createHashRouter([
    {
      path: '/',
      element: <CollectionPage />,
    },
    {
      path: `/${AppRoutes.listNft}`,
      element: <ListNftPage />,
    },
    {
      path: `/${AppRoutes.nftDetail}/:tokenId`,
      element: <NftDetailPage />,
    },
    {
      path: `/${AppRoutes.orderDetail}/:orderNonce`,
      element: <BuyNftPage />,
    },
    {
      path: `/${AppRoutes.profile}/:account`,
      children: [
        {
          element: <ProfilePage />,
          path: ProfileRoutes.ownedNfts,
        },
        {
          path: ProfileRoutes.orders,
          element: <ProfileOrdersPage />,
        },
        {
          element: <Navigate to={ProfileRoutes.ownedNfts} />,
          index: true,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} />
  );
};

export default Routes;
