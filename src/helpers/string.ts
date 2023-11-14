export const truncateAddress = (account: string): string => (account.length >= 20 ? `${account.slice(0, 6)}...${account.slice(-4)}` : account);

export const isEqualAddress = (address1: string, address2: string): boolean => address1.toLowerCase() === address2.toLowerCase();
