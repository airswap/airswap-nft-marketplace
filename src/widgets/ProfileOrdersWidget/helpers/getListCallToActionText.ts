const getListCallToActionText = (hasFilter: boolean, userHasOrders: boolean, hasServerError: boolean): string => {
  if (hasServerError) {
    return 'Unable to fetch listings.';
  }

  if (userHasOrders && hasFilter) {
    return 'No listing results. Try changing filters.';
  }

  return 'No active listings by this wallet.';
};

export default getListCallToActionText;
