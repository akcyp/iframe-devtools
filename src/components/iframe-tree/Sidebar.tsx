import { Tree } from './Tree';
import { Node } from './shared';

import classses from './Sidebar.module.css';

interface IframeSidebarProps {
  iframes: Node[];
  selectedId?: string;
  onSelect?: (node: Node) => void;
  onDblClick?: (node: Node) => void;
}

export const IframeSidebar = ({ iframes, selectedId, onSelect, onDblClick }: IframeSidebarProps) => {
  return (
    <div className={classses.sidebar}>
      <Tree
        iframes={iframes}
        selectedId={selectedId}
        onSelect={onSelect}
        onDblClick={onDblClick}
      />
    </div>
  );
};
