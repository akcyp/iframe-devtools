import Browser from 'webextension-polyfill';

const devtoolsConnections = new Map<number, Browser.Runtime.Port>();
const messagesPerTab = new Map<number, any[]>();

Browser.runtime.onConnect.addListener((port) => {
  console.log('[Iframe Inspector] Connection attempt:', port.name);
  
  if (port.name.startsWith('devtools-')) {
    const tabId = parseInt(port.name.split('-')[1]);
    devtoolsConnections.set(tabId, port);

    console.log(`[Iframe Inspector] Devtools connected for tab ${tabId}. Active connections:`, Array.from(devtoolsConnections.keys()));

    const storedMessages = messagesPerTab.get(tabId) || [];
    if (storedMessages.length > 0) {
      port.postMessage({
        type: 'IFRAME_MESSAGES_HISTORY',
        messages: storedMessages,
      });
      console.log(`[Iframe Inspector] Sent ${storedMessages.length} stored messages to devtools`);
    }

    port.onMessage.addListener((message: unknown) => {
      const msg = message as { type: string };
      switch (msg.type) {
        case 'CLEAR_MESSAGES':
          messagesPerTab.set(tabId, []);
          console.log(`[Iframe Inspector] Cleared messages for tab ${tabId}`);
          break;
      }
    });

    port.onDisconnect.addListener(() => {
      devtoolsConnections.delete(tabId);
      console.log(`[Iframe Inspector] Devtools disconnected for tab ${tabId}`);
    });
  }
});

Browser.runtime.onMessage.addListener((message: unknown, sender: Browser.Runtime.MessageSender) => {
  const msg = message as { type: string; message?: unknown };

  if (msg.type === 'IFRAME_MESSAGE_INTERCEPTED' && sender.tab?.id) {
    const tabId = sender.tab.id;
    if (!messagesPerTab.has(tabId)) {
      messagesPerTab.set(tabId, []);
    }
    const messages = messagesPerTab.get(tabId)!;
    messages.push(msg.message);
    if (messages.length > 1000) {
      messages.shift();
    }

    const devtoolsPort = devtoolsConnections.get(tabId);
    console.log(`[Iframe Inspector] Message from tab ${tabId}. Has devtools connection:`, !!devtoolsPort);
    
    if (devtoolsPort) {
      devtoolsPort.postMessage({
        type: 'IFRAME_MESSAGE',
        message: msg.message,
      });
      console.log('[Iframe Inspector] Message relayed to devtools');
    }
  }
});

Browser.tabs.onRemoved.addListener((tabId) => {
  messagesPerTab.delete(tabId);
  devtoolsConnections.delete(tabId);
  console.log(`[Iframe Inspector] Cleaned up data for closed tab ${tabId}`);
});

console.log('[Iframe Inspector] Background script loaded');
