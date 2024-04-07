export function debounce(func, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: Array<unknown>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
