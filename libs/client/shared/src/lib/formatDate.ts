export const formatDate = (date: string | null | undefined) => {
  return date ? new Date(date).toLocaleDateString('ru-RU') : ' ';
};
