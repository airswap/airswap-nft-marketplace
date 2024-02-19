export const getEnumKeyByEnumValue = <T extends {[index: string]: string}>(myEnum: T, enumValue: string): keyof T | undefined => {
  const key = Object.keys(myEnum).find(x => myEnum[x] === enumValue);

  return key || undefined;
};
