export const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // For same-origin, show pathname. For cross-origin show hostname + pathname
    if (urlObj.origin === window.location.origin) {
      return urlObj.pathname + urlObj.search + urlObj.hash;
    }
    return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '') + urlObj.search + urlObj.hash;
  } catch {
    return url;
  }
};
