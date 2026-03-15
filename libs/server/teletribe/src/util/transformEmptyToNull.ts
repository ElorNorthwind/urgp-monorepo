export function transformEmptyToNull(obj: Record<string, any>) {
  for (const key in obj) {
    if (obj[key] === '-' || obj[key] === '') {
      obj[key] = null;
    }
  }
  return obj;
}
