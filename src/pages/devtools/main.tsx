import Browser from 'webextension-polyfill';
import { useCallback, useState } from 'react';
import { MessagesTable } from '@src/components/messages-table/MessagesTable';
import { IframeSidebar } from '@src/components/iframe-tree/Sidebar';
import { IframeMessage } from '@src/types/message';
import { useIframeTree } from './hooks/useIframeTree';
import { useMessages } from './hooks/useMessages';
import { Toolbar } from '@src/components/toolbar/Toolbar';
import { Node as IframeNode } from '@src/components/iframe-tree/shared';
import { MessageDetailsSidebar } from '@src/components/message-details/Sidebar';

interface MainProps {
  port: Browser.Runtime.Port;
}

export const Main = ({ port }: MainProps) => {
  const { messages, clearMessages } = useMessages(port);
  console.log(messages);
  const iframes = useIframeTree(port);

  const [filterText, setFilterText] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<IframeMessage | null>(null);
  const [showIframeSidebar, setShowIframeSidebar] = useState(true);
  const [selectedIframeId, setSelectedIframeId] = useState<string>('0');

  const clear = useCallback(() => {
    clearMessages();
    setSelectedMessage(null);
  }, [clearMessages]);

  const handleMessageSelect = useCallback((message: IframeMessage | null) => {
    setSelectedMessage(message);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  const toggleIframeSidebar = useCallback(() => {
    setShowIframeSidebar(!showIframeSidebar);
  }, [showIframeSidebar]);

  const handleIframeSelect = useCallback((node: IframeNode) => {
    setSelectedIframeId(node.id);
  }, []);

  const handleIframeDblClick = useCallback((node: IframeNode) => {
    setFilterText(node.url);
  }, []);

  return (
    <div className="vbox" style={{ height: '100%' }}>
      <Toolbar
        filterText={filterText}
        setFilterText={setFilterText}
        onClear={clear}
        onToggleIframeSidebar={toggleIframeSidebar}
      />
      <div className="hbox flex-auto">
        {showIframeSidebar && (
          <IframeSidebar
            iframes={iframes}
            selectedId={selectedIframeId}
            onSelect={handleIframeSelect}
            onDblClick={handleIframeDblClick}
          />
        )}
        <div className="vbox flex-auto">
          <MessagesTable
            messages={messages}
            filterText={filterText}
            onMessageSelect={handleMessageSelect}
          />
        </div>
        {selectedMessage && (
          <MessageDetailsSidebar message={selectedMessage} onClose={handleCloseDetails} />
        )}
      </div>
    </div>
  );
}
