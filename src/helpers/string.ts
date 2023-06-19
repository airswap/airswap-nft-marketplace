export const truncateAddress = (account: string): string => (account.length >= 20 ? `${account.slice(0, 6)}...${account.slice(-4)}` : account);
