export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}

export function shareLink(url: string, title = "Market Intel") {
  if (navigator.share) {
    return navigator.share({ title, url });
  }
  return copyToClipboard(url);
}

export function downloadText(
  filename: string,
  text: string,
  mime = "application/json"
) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
