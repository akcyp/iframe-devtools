const basicFilter = <T>(data: T[], text: string): T[] => {
  const lowerText = text.toLowerCase();
  return data.filter((item) => JSON.stringify(item).toLowerCase().includes(lowerText));
};

const regexpPattern = /^\/(?<pattern>.*)\/(?<flags>[gimsuy]*)$/;

const isRegexp = (text: string): boolean => {
  return text.startsWith('/') && regexpPattern.test(text);
};

const objectFieldMatchRegexp = (obj: object, regex: RegExp): boolean => {
  if (obj === null || obj === undefined) return false;
  return Object.values(obj).some((value) => {
    return regex.test(JSON.stringify(value));
  });
};

export const filter = <T>(data: T[], text: string): T[] => {
  if (!text) return data;
  if (isRegexp(text)) {
    try {
      const match = text.match(regexpPattern);
      if (!match || !match.groups) return [];
      const { pattern, flags } = match.groups;
      const regex = new RegExp(pattern, flags);
      return data.filter((item) => objectFieldMatchRegexp(item as object, regex));
    } catch {
      return [];
    }
  }
  return basicFilter(data, text);
};
