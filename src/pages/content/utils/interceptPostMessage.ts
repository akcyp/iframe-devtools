import { getFrameInfo } from "./getFrameInfo";
import { getObjectSize } from "./getObjectSize";

export const interceptIframePostMessage = (contentWindow: Window, isIframe: boolean) => {
  const frameInfo = getFrameInfo();
  const _ = contentWindow.postMessage;
  contentWindow.postMessage = function () {
    const result = _.apply(this, arguments as any);
    const [message, targetOrigin] = arguments;

    // Handle both signatures of postMessage
    const actualTargetOrigin = typeof targetOrigin === 'string'
      ? targetOrigin
      : (targetOrigin?.targetOrigin || '*');

    window.dispatchEvent(new CustomEvent('__IFRAME_INSPECTOR_MESSAGE__', {
      detail: {
        type: 'postMessage',
        timestamp: Date.now(),
        direction: 'sent',
        source: frameInfo.url,
        sourceOrigin: frameInfo.origin,
        target: actualTargetOrigin,
        data: message,
        size: getObjectSize(message),
        isSourceTop: frameInfo.isTop,
        isTargetTop: contentWindow === window.top,
        frameId: frameInfo.frameId,
      }
    }));

    return result;
  };
};
