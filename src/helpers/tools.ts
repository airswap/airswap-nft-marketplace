// eslint-disable-next-line no-promise-executor-return
export const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

export const createError: (name: string, message: string) => Error = (name, message) => ({
  name,
  message,
} as Error);
