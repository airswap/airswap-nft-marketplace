// eslint-disable-next-line no-promise-executor-return
export const wait = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

export const getElementVisibleChildrenIndices = (element: Element): { start: number, end: number } => {
  const firstChild = element?.firstChild as Element | null;

  if (!element || !firstChild) {
    return { start: 0, end: 0 };
  }

  const { clientHeight, scrollTop } = element;
  const itemHeight = firstChild.clientHeight;
  const start = Math.floor(scrollTop / itemHeight);
  const end = start + Math.ceil(clientHeight / itemHeight);

  return { start, end };
};

