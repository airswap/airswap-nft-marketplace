const getListCallToActionText = (searchValue: string, userHasTokens: boolean): string => {
  if (searchValue.length) {
    return 'No listing results. Try another search term.';
  }

  if (userHasTokens) {
    return 'No active listings. List a token.';
  }

  return 'No active listings.';
};

export default getListCallToActionText;
