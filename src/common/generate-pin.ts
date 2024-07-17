export const generatePin = (): string => {
  const segments = Array.from({ length: 3 }, () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
  return segments.join('-');
};
