import { interceptMessages } from "./utils/interceptMessages";

try {
  interceptMessages();
  // TODO: intercept window.postMessage
} catch (e) {
  console.error('[Iframe Inspector: content] Error:', e);
}
