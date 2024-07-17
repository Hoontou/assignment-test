//TODO 지금은 uniqe하지 않음
export const generatePin = (): string => {
  const segments = Array.from({ length: 3 }, () =>
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
  return segments.join('-');
};
