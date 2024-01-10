// eslint-disable-next-line no-promise-executor-return
export const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

