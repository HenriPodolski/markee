import { useEffect, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';

export const useDebounce = <T extends unknown>(
  callback: () => T,
  delay: number
) => {
  const ref = useRef<() => T>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, delay);
  }, []);

  return debouncedCallback;
};
