import { useRef, useEffect } from 'react';

export const useScrollIntoViewOnMount = <
  T extends HTMLElement
>(): React.RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, []);

  return ref;
};
