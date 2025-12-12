import { ToolbarDivider } from './ToolbarDivider';
import { ToolbarInput } from './ToolbarInput';
import { ToolbarButton } from './ToolbarButton';

import clearIcon from '../../assets/icons/clear.svg';
import toggleSidebarIcon from '../../assets/icons/left-panel-open.svg';
import classes from './Toolbar.module.css';

export interface ToolbarProps {
  filterText: string;
  setFilterText: (text: string) => void;
  onClear: () => void;
  onToggleIframeSidebar: () => void;
}

export const Toolbar = ({
  filterText,
  setFilterText,
  onClear,
  onToggleIframeSidebar,
}: ToolbarProps) => {
  return (
    <div className={classes.toolbar}>
      <ToolbarButton
        title="Toggle iframes view"
        onClick={onToggleIframeSidebar}
        icon={toggleSidebarIcon}
      />
      <ToolbarButton title="Clear all messages" onClick={onClear} icon={clearIcon} />
      <ToolbarDivider />
      <ToolbarInput filterText={filterText} setFilterText={setFilterText} />
    </div>
  );
};
