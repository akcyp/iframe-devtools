import classes from './CloseButton.module.css';

export interface CloseButtonProps {
  onClick: () => void;
}

export const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <button
      className={classes.btn}
      onClick={onClick}
      title="Close details"
    > ✕
    </button>
  );
}
