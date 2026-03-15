export function strToBool(str: string | undefined | null) {
  return /да/i.test(str || '') ? true : /нет/i.test(str || '') ? false : null;
}
