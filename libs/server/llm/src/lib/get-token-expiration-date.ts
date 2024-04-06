export function getTokenExpirationDate(): Date {
  const currentDate = new Date();
  return new Date(
    currentDate.getTime() +
      parseInt(process.env['GPT_TOKEN_EXPIRATION'] || '29') * 60000,
  );
}
