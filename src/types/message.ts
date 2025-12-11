export interface IframeMessage {
  id: string;
  timestamp: number;
  direction: 'sent' | 'received';
  source: string;
  target: string;
  data: unknown;
  size: number;
  frameId?: string;
  isSourceTop?: boolean;
  isTargetTop?: boolean;
  sourceOrigin?: string;
  targetOrigin?: string;
}
