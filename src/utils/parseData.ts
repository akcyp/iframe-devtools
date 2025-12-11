export const parseData = (data: unknown): object | string => {
  if (typeof data === 'object' && data !== null) {
    return data;
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return String(data);
    }
  }
  return String(data);
};
