export function rawText(text?: string): string {
  // Textos em minúsculo e sem acento.
  if (!text) return '';
  return text.normalize('NFKD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function objectAllKeys(arr: any[]): string[] {
  return [...new Set(arr.flatMap(Object.keys))];
}

export function isISODate(str: any): boolean {
  if (typeof str === 'string') {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)$/;
    return iso8601Regex.test(str);
  } else return false;
}