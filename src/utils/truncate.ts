import { stringify } from "./stringify";

export const truncate = (data: unknown, maxLength = 80): string => {
  const formatted = stringify(data);
  if (formatted.length <= maxLength) return formatted;
  return formatted.slice(0, maxLength) + '...';
};
