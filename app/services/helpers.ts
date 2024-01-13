export function rawText(text?: string): string {
  // Textos em minúsculo e sem acento.
  if (!text) return '';
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}