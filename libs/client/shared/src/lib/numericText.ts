export const numericHouses = (value: number) => {
  const lastLetter = value.toString().slice(-1);
  if (lastLetter === '1') {
    return `дом`;
  } else if (['2', '3', '4'].includes(lastLetter)) {
    return `дома`;
  } else {
    return `домов`;
  }
};
export const numericCases = (value: number) => {
  const lastLetter = value.toString().slice(-1);
  if (lastLetter === '1') {
    return `дело`;
  } else if (['2', '3', '4'].includes(lastLetter)) {
    return `дела`;
  } else {
    return `дел`;
  }
};
