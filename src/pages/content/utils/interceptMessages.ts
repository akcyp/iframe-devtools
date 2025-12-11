import { getFrameInfo } from "./getFrameInfo";
import { getObjectSize } from "./getObjectSize";

export const interceptMessages = () => {
  window.addEventListener('message', event => {
    const frameInfo = getFrameInfo();
    
    // Get source window URL if possible
    let sourceUrl = event.origin;
    try {
      // Try to get the actual source window's location
      if (event.source && (event.source as Window).location) {
        sourceUrl = (event.source as Window).location.href;
      }
    } catch (e) {
      // Cross-origin - use event.origin
      sourceUrl = event.origin;
    }
    
    window.dispatchEvent(new CustomEvent('__IFRAME_INSPECTOR_MESSAGE__', {
      detail: {
        type: 'messageReceived',
        timestamp: Date.now(),
        direction: 'received',
        source: sourceUrl,
        sourceOrigin: event.origin,
        target: frameInfo.url,
        targetOrigin: frameInfo.origin,
        data: event.data,
        size: getObjectSize(event.data),
        isTargetTop: frameInfo.isTop,
        isSourceTop: event.source === window.top,
        frameId: frameInfo.frameId,
      }
    }));
  }, true);
};
