function getIsBraveWallet(): boolean {
  return window.ethereum?.isBraveWallet ?? false;
}

export function getHasMetaMaskExtensionInstalled(): boolean {
  return (window.ethereum?.isMetaMask ?? false) && !getIsBraveWallet();
}
