const getEmptyStateText = (searchValue: string, userHasTokens: boolean): string => {
  if (userHasTokens && searchValue.length) {
    return 'No tokens found. Try another search term.';
  }

  return 'No tokens held by this wallet.';
};

export default getEmptyStateText;
