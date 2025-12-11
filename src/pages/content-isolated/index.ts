import Browser from 'webextension-polyfill';
import { IframeMessage } from '@src/types/message';

const setupMessageListener = () => {
  window.addEventListener('__IFRAME_INSPECTOR_MESSAGE__', ((event: CustomEvent) => {
    const messageData = event.detail;

    const message: IframeMessage = {
      id: `${messageData.timestamp}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: messageData.timestamp,
      direction: messageData.direction,
      source: messageData.source,
      target: messageData.target,
      data: messageData.data,
      size: messageData.size,
      frameId: messageData.frameId,
      isSourceTop: messageData.isSourceTop,
      isTargetTop: messageData.isTargetTop,
      sourceOrigin: messageData.sourceOrigin,
      targetOrigin: messageData.targetOrigin,
    };

    Browser.runtime.sendMessage({
      type: 'IFRAME_MESSAGE_INTERCEPTED',
      message,
      tabId: Browser.devtools?.inspectedWindow?.tabId,
    }).catch(err => {
      // If devtools isn't open, this might fail - that's ok
    });
  }) as EventListener);
};

try {
  setupMessageListener();
} catch (e) {
  console.error('[Iframe Inspector: content-isolated] Error:', e);
}
