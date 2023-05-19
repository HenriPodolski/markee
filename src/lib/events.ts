const on = (
  eventType: string,
  listener: (...args: unknown[]) => void
): void => {
  document.addEventListener(eventType, listener);
};

const off = (
  eventType: string,
  listener: (...args: unknown[]) => void
): void => {
  document.removeEventListener(eventType, listener);
};

const once = (
  eventType: string,
  listener: (...args: unknown[]) => void
): void => {
  const handleEventOnce: (event: string) => void = (event: string): void => {
    listener(event);
    off(eventType, handleEventOnce as () => void);
  };

  on(eventType, handleEventOnce as () => void);
};

const trigger = <T>(eventType: string, data: T = {} as T): void => {
  const event = new CustomEvent(eventType, { detail: data });
  document.dispatchEvent(event);
};

export { on, once, off, trigger };
