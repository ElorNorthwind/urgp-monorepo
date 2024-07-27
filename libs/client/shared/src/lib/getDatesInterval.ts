export const getDatesInterval = (
  date1: string | null,
  date2?: string | null,
) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

  if (date1 === null || date2 === null) {
    return 0;
  }

  if (date2 === undefined) {
    return Math.round((new Date(date2).getTime() - Date.now()) / oneDay);
  }

  if (date1 && date2) {
    return Math.round(
      (new Date(date2).getTime() - new Date(date2).getTime()) / oneDay,
    );
  }
};
