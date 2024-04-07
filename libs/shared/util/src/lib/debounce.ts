import { useEffect, useState } from 'react';

export function debounce(func, timeout = 300) {
  let timer: NodeJS.Timeout;
  return (...args: Array<unknown>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export function useDebounce(value: string, delay = 300): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
