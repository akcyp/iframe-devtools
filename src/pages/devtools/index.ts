import Browser from 'webextension-polyfill';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Main } from './main';

import './index.css';

Browser.devtools.panels
  .create('Iframe inspector', 'icon-48x48.png', 'src/pages/devtools/index.html')
  .catch(console.error)
  .then((panel) => {
    if (!panel) throw new Error('Failed to create devtools panel');
    console.log('[Iframe Inspector] Devtools panel created');

    const tabId = Browser.devtools.inspectedWindow.tabId;
    const port = Browser.runtime.connect({ name: `devtools-${tabId}` });

    console.log(`[Iframe Inspector] Connected to background for tab ${tabId}`);

    const rootContainer = document.querySelector('#__root');
    if (!rootContainer) throw new Error("Can't find Popup root element");
    const root = createRoot(rootContainer);
    root.render(createElement(Main, { port }));

    panel.onHidden.addListener(() => {
      root.unmount();
    });
  });
