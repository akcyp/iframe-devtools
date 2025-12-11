import classes from './ToolbarInput.module.css';

export interface ToolbarInputProps {
  filterText: string;
  setFilterText: (text: string) => void;
}

export const ToolbarInput = ({ filterText, setFilterText }: ToolbarInputProps) => {
  return (
    <div className={classes.wrapper}>
      <div className={classes['icon-filter']} />
      <input
        type="text"
        placeholder="Filter"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  )
};
