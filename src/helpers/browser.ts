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
