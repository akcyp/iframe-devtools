import { TreeNode } from './TreeNode';
import { Node } from './shared';

import classes from './Tree.module.css';

interface TreeProps {
  iframes: Node[];
  selectedId?: string;
  onSelect?: (node: Node) => void;
  onDblClick?: (node: Node) => void;
}

export const Tree = ({ iframes, selectedId, onSelect, onDblClick }: TreeProps) => {
  return (
    <div className={classes.tree}>
      {iframes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          onSelect={onSelect}
          onDblClick={onDblClick}
        />
      ))}
    </div>
  );
};
