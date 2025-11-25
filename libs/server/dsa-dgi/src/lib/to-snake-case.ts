export const camelToSnakeCase = (str: string) =>
  str[0].toLowerCase() +
  str
    .slice(1, str.length)
    .replace(/[A-Z\d]/g, (letter) => `_${letter.toLowerCase()}`);
