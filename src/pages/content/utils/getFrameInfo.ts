interface FrameInfo {
  url: string;
  origin: string;
  isTop: boolean;
  frameId: string;
}

export const getFrameInfo = (): FrameInfo => {
  try {
    return {
      url: window.location.href,
      origin: window.location.origin,
      isTop: window === window.top,
      frameId: window.name || 'anonymous',
    };
  } catch (e) {
    return {
      url: 'about:blank',
      origin: 'unknown',
      isTop: false,
      frameId: 'unknown',
    };
  }
};
