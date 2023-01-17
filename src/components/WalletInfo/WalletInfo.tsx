import React, { FC } from "react";

import classNames from "classnames";

import IconButton from "../../compositions/IconButton/IconButton";
import Avatar from "../Avatar/Avatar";

import "./WalletInfo.scss";

interface WalletInfoProps {
<<<<<<< HEAD
  isBanner?: boolean;
  avatarUrl?: string;
=======
  isBanner?: boolean
  isMobileMenu?: boolean;
>>>>>>> 5b8fd66 (styling fixes)
  address?: string;
  className?: string;
}

const WalletInfo: FC<WalletInfoProps> = ({
  isBanner = false,
<<<<<<< HEAD
  avatarUrl = "",
  address = "",
  className = "",
=======
  isMobileMenu = true,
  address = '',
  className = '',
>>>>>>> 5b8fd66 (styling fixes)
}) => {
  const walletInfoClassName = classNames(
    "wallet-info",
    {
      "wallet-info--is-banner": isBanner,
      "wallet-info--is-menu": !isBanner,
    },
    className
  );

  return (
    <div className={walletInfoClassName}>
<<<<<<< HEAD
      <Avatar className="wallet-info__avatar" avatarUrl={avatarUrl} />
      <span className="wallet-info__address">{address}</span>
=======
      {isMobileMenu && <div className="wallet-info__img" />}
      <span className="wallet-info__address">{truncateAddress(address)}</span>
>>>>>>> 5b8fd66 (styling fixes)
      {isBanner && (
        <IconButton
          hideLabel
          icon="launch"
          text="wallet"
          iconClassName="wallet-info__icon"
        />
      )}
      <IconButton
        hideLabel
        icon="logout"
        text="logout"
        iconClassName="wallet-info__icon"
      />
    </div>
  );
};

export default WalletInfo;
