export const transformToAddress = (
  address: string,
  ensAddress: string | null = null,
  isLoading = false,
) => ({
  isLoading,
  address,
  ...(ensAddress && { ens: ensAddress }),
});
