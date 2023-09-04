const getListCallToActionText = (searchValue: string, userHasOrders: boolean): string => {
  if (userHasOrders && searchValue.length) {
    return 'No listing results. Try another search term.';
  }

  return 'No active listings by this wallet.';
};

export default getListCallToActionText;
