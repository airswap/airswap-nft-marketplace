import { FC, PropsWithChildren, ReactElement } from 'react';

import Page from '../../compositions/Page/Page';
import useCollectionName from '../../hooks/useCollectionName';
import useEnsAddress from '../../hooks/useEnsAddress';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { disableDemoAccount } from '../../redux/stores/config/configSlice';
import { clearLastProviderFromLocalStorage } from '../../redux/stores/web3/web3Api';
import { setShowConnectModal } from '../../redux/stores/web3/web3Slice';
import { getConnection } from '../../web3-connectors/connections';
import { tryDeactivateConnector } from '../../web3-connectors/helpers';

interface ConnectedPageProps {
  className?: string;
  contentClassName?: string;
}

const ConnectedPage: FC<PropsWithChildren<ConnectedPageProps>> = ({
  className = '',
  contentClassName = '',
  children,
}): ReactElement => {
  const dispatch = useAppDispatch();

  const { isActive, account, chainId } = useAppSelector(state => state.web3);
  const { config } = useAppSelector((state) => state);
  const { isInitialized, showConnectModal, connectionType } = useAppSelector((state) => state.web3);
  const { avatarUrl } = useAppSelector((state) => state.user);

  const ensAddress = useEnsAddress(account || '');
  const collectionName = useCollectionName();

  const chainIdIsCorrect = !!chainId && chainId === config.chainId;

  const handleDisconnectButtonClick = (): void => {
    if (!connectionType) {
      return;
    }

    tryDeactivateConnector(getConnection(connectionType).connector);
    clearLastProviderFromLocalStorage();
  };

  const toggleShowWalletConnector = (): void => {
    dispatch(setShowConnectModal(!showConnectModal));
  };

  const handleConnectButtonClick = (): void => {
    toggleShowWalletConnector();
    window.scrollTo(0, 0);
  };

  const handleDisableDemoAccountClick = (): void => {
    dispatch(disableDemoAccount());
  };

  return (
    <Page
      isActive={isActive}
      listButtonIsDisabled={!chainIdIsCorrect || !account}
      showConnectModal={showConnectModal}
      showConnectButton={isInitialized && !isActive}
      showDesktopUserButton={isInitialized && isActive}
      showDisableDemoAccountButton={config.isDemoAccount}
      showMobileMenuButton={isActive}
      userWalletButtonIsDisabled={!chainIdIsCorrect}
      avatarUrl={avatarUrl}
      account={account}
      collectionName={collectionName}
      ensAddress={ensAddress}
      onCloseWalletConnectorButtonClick={toggleShowWalletConnector}
      onConnectButtonClick={handleConnectButtonClick}
      onDisableDemoAccountButtonClick={handleDisableDemoAccountClick}
      onDisconnectButtonClick={handleDisconnectButtonClick}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </Page>
  );
};

export default ConnectedPage;
