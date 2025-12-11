import { IframeMessage } from '@src/types/message';

import classes from './Sidebar.module.css';
import { formatTime } from '../../utils/formatTime';
import { Preview } from './Preview';
import { CloseButton } from './CloseButton';
import { DetailsRow } from './DetailsRow';

export interface MessageDetailsProps {
  message: IframeMessage;
  onClose: () => void;
}

export const MessageDetailsSidebar = ({ message, onClose }: MessageDetailsProps) => {
  return (
    <div className={classes.sidebar}>
      <div className={classes.container}>
        <div className={classes.section}>
          <div className={classes.header}>
            Message Details
            <CloseButton onClick={onClose} />
          </div>

          <DetailsRow
            label="Time"
            value={formatTime(message.timestamp)}
            monospace
          />

          <DetailsRow
            label="Direction"
            value={
              <span className={message.direction === 'sent' ? classes.blue : classes.green}>
                {message.direction === 'sent' ? '→ Sent' : '← Received'}
              </span>
            }
          />

          <DetailsRow
            label="Source"
            value={<span className={classes.code}>{message.source}</span>}
          />

          <DetailsRow
            label="Target"
            value={<span className={classes.code}>{message.target}</span>}
          />

          <DetailsRow
            label="Size"
            value={<span className={classes.monospace}>{message.size} B</span>}
          />
        </div>
        <div className={classes.section}>
          <div className={classes.header}>Data</div>
          <Preview data={message.data} />
        </div>
      </div>
    </div>
  );
};
