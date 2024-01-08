export default async function writeTextToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard || !navigator.clipboard.writeText) {
    return false;
  }

  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => {
      console.error('Async: Error copying text to clipboard');
      return false;
    });
}

type EventPathElement = Element | Document | Window;

export const generateEventPath = (eventTarget: EventTarget | null): EventPathElement[] => {
  if (eventTarget === null || !window) {
    return [];
  }

  const path: EventPathElement[] = [];
  let element: Element | null = eventTarget as Element;

  while (element) {
    path.push(element);

    // Can't copy dom-related objects
    // eslint-disable-next-line no-param-reassign
    element = element.parentElement;
  }

  if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
    path.push(document);
  }

  if (path.indexOf(window) === -1) {
    path.push(window);
  }

  return path;
};
