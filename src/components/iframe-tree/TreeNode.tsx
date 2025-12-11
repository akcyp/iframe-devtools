import { useCallback, useState } from 'react';
import { Node } from './shared';
import cs from 'classnames';

import classes from './TreeNode.module.css';

interface TreeNodeProps {
  node: Node;
  level: number;
  selectedId?: string;
  onSelect?: (node: Node) => void;
  onDblClick?: (node: Node) => void;
}

export const TreeNode = ({ node, level, selectedId, onSelect, onDblClick }: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.id === selectedId;

  const handleClick = useCallback(() => {
    onSelect?.(node);
  }, [onSelect, node]);

  const handleDblClick = useCallback(() => {
    onDblClick?.(node);
  }, [onDblClick, node]);

  const handleToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  return (
    <>
      <div
        className={cs(classes.node, { [classes.selected]: isSelected })}
        style={{ paddingLeft: `${level * 12 + 4}px` }}
        onClick={handleClick}
        onDoubleClick={handleDblClick}
      >
        {hasChildren && (
          <span
            className={cs(classes.disclosure, { [classes.expanded]: isExpanded })}
            onClick={handleToggle}
            children={"▸"}
          />
        )}
        {!hasChildren && <span className={classes.disclosurePlaceholder} />}
        <div className={cs(classes.icon, { [classes.top]: level === 0 })} />
        <span className={classes.title}>{node.title || node.url}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className={classes.children}>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              onSelect={onSelect}
              onDblClick={onDblClick}
            />
          ))}
        </div>
      )}
    </>
  );
};
