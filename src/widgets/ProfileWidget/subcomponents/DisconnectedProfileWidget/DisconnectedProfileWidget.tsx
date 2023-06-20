import { FC, useMemo } from 'react';

import getOwnedTokensByAccountUrl from '../../../../helpers/airswap/getOwnedTokensByAccountUrl';
import useEnsAddress from '../../../../hooks/useEnsAddress';
import { useAppSelector } from '../../../../redux/hooks';
import ProfileHeader from '../ProfileHeader/ProfileHeader';

interface ConnectedProfileWidgetProps {
  profileAccount?: string;
  className?: string;
}

const ConnectedProfileWidget: FC<ConnectedProfileWidgetProps> = ({
  profileAccount,
  className = '',
}) => {
  const { chainId, collectionToken, collectionImage } = useAppSelector((state) => state.config);
  const { avatarUrl } = useAppSelector((state) => state.user);

  const ensAddress = useEnsAddress(profileAccount);
  const accountUrl = useMemo(() => (
    profileAccount ? getOwnedTokensByAccountUrl(chainId, profileAccount, collectionToken) : undefined
  ), [profileAccount, chainId, collectionToken]);

  return (
    <div className={`profile-widget ${className}`}>
      <ProfileHeader
        accountUrl={accountUrl}
        avatarUrl={avatarUrl}
        backgroundImage={collectionImage}
        ensAddress={ensAddress}
        address={profileAccount}
        className="profile-widget__header"
      />
    </div>
  );
};

export default ConnectedProfileWidget;
