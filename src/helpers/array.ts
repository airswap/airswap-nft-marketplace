export const getUniqueArrayChildren = <T>(array: T[], key: string) => [...new Map(array.map((item: any) => [item[key], item])).values()];

export const getUniqueSingleDimensionArray = <T>(value: T, index: number, array: T[]) => array.indexOf(value) === index;

