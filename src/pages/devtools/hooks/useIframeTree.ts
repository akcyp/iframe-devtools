import Browser from 'webextension-polyfill';
import { useCallback, useEffect, useState } from 'react';
import { Node } from '@src/components/iframe-tree/shared';

const convertFramesToTree = (
  frames: Browser.WebNavigation.GetAllFramesCallbackDetailsItemType[],
): Node[] => {
  const frameMap: Record<number, Node & { parentFrameId: number | null }> = {};

  frames.forEach((frame) => {
    frameMap[frame.frameId] = {
      id: frame.frameId.toString(),
      url: frame.url,
      title: frame.url, // Placeholder, as title is not provided
      children: [],
      parentFrameId: frame.parentFrameId,
    };
  });

  const rootFrames: Node[] = [];

  Object.values(frameMap).forEach((frame) => {
    if (frame.parentFrameId !== null && frameMap[frame.parentFrameId]) {
      frameMap[frame.parentFrameId].children!.push(frame);
    } else {
      rootFrames.push(frame);
    }
  });

  return rootFrames;
};

export const useIframeTree = (port: Browser.Runtime.Port) => {
  const [iframes, setIframes] = useState<Node[]>([]);

  const tabId = Browser.devtools.inspectedWindow.tabId;

  const fetchIframeTree = useCallback(async () => {
    try {
      const frames = await Browser.webNavigation.getAllFrames({ tabId });
      if (frames) {
        setIframes(convertFramesToTree(frames));
      }
    } catch (error) {
      console.error('[Iframe Inspector] Failed to fetch iframe tree:', error);
    }
  }, [tabId]);

  useEffect(() => {
    // Listen for frame tree from background
    const handleMessage = (message: unknown) => {
      const msg = message as { type: string; data: Node[] };
      if (typeof msg === 'object' && msg.type === 'FRAME_TREE_RESPONSE') {
        setIframes(msg.data);
      }
    };

    port.onMessage.addListener(handleMessage);
    fetchIframeTree();

    const intervalId = setInterval(fetchIframeTree, 2000);

    return () => {
      port.onMessage.removeListener(handleMessage);
      clearInterval(intervalId);
    };
  }, [port, fetchIframeTree]);

  return iframes;
};
