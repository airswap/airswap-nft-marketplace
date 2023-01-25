export const getUniqueArrayChildren = <T>(array: T[], key: string) => [...new Map(array.map((item: any) => [item[key], item])).values()];
