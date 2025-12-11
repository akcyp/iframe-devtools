import classes from './ToolbarButton.module.css';

export interface ToolbarIconProps {
  title: string;
  onClick: () => void;
  icon: string;
}

export const ToolbarButton = ({ title, onClick, icon }: ToolbarIconProps) => {
  return (
    <button
      className={classes.btn}
      title={title}
      aria-label={title}
      onClick={onClick}
      style={{ '--icon-url': `url("${icon}")` } as React.CSSProperties}
    />
  );
};
