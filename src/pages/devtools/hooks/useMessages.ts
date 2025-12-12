import Browser from 'webextension-polyfill';
import { IframeMessage } from '@src/types/message';
import { useEffect, useState } from 'react';

export const useMessages = (port: Browser.Runtime.Port) => {
  const [messages, setMessages] = useState<IframeMessage[]>([]);

  // Listen for intercepted messages from the background script
  useEffect(() => {
    const messageListener = (message: unknown) => {
      const msg = message as { type: string; message?: IframeMessage; messages?: IframeMessage[] };
      console.log('[Iframe Inspector] Received message in devtools:', msg);
      if (msg.type === 'IFRAME_MESSAGE' && msg.message) {
        setMessages((prev) => [...prev, msg.message!]);
      } else if (msg.type === 'IFRAME_MESSAGES_HISTORY' && msg.messages) {
        // Load stored messages from background script
        setMessages(msg.messages);
      }
    };

    port.onMessage.addListener(messageListener);

    return () => {
      port.onMessage.removeListener(messageListener);
    };
  }, [port]);

  const clearMessages = () => {
    setMessages([]);
    // Notify background script to clear stored messages
    port.postMessage({ type: 'CLEAR_MESSAGES' });
  };

  return {
    messages,
    clearMessages,
  };
};
