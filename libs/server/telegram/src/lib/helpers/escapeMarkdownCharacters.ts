export const escapeMarkdownCharacters = (text: string) => {
  const regex = /([_*\[\]()~`>#+\-=|{}.!-])/g;
  return text.replace(regex, '\\$1');
};
