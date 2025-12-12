export const getObjectSize = (obj: unknown) => {
  try {
    return new Blob([JSON.stringify(obj)]).size;
  } catch {
    return 0;
  }
};
