const getListCallToActionText = (
  hasFilters: boolean,
  userHasTokens: boolean,
  hasServerError: boolean,
): string => {
  if (hasServerError) {
    return 'Unable to fetch listings.';
  }

  if (hasFilters) {
    return 'No listing results. Try another filter.';
  }

  if (userHasTokens) {
    return 'No active listings. List a token.';
  }

  return 'No active listings.';
};

export default getListCallToActionText;
