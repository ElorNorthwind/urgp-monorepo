export type Replacement = {
  pattern: RegExp;
  replacement: string;
};

export function deletePatterns(text: string, patterns: RegExp[]): string {
  let result = text;
  for (const pattern of patterns) {
    result = result.replace(pattern, '');
  }
  return result;
}

export function replacePatterns(
  text: string,
  replacements: Replacement[],
  before?: string,
  after?: string,
): string {
  let result = text;
  for (const { pattern, replacement } of replacements) {
    result = result.replace(
      pattern,
      (before ?? '') + replacement + (after ?? ''),
    );
  }
  return result;
}

export function findPatterns(
  text: string,
  replacements: Replacement[],
): string | null {
  let result = null;
  for (const { pattern, replacement } of replacements) {
    if (text.match(pattern)) result = replacement;
  }
  return result;
}
