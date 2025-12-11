import cs from "classnames";
import classes from "./DetailsRow.module.css";

export interface DetailsRowProps {
  label: string;
  value: React.ReactNode;
  monospace?: boolean;
}

export const DetailsRow = ({ label, value, monospace }: DetailsRowProps) => {
  return (
    <div className={classes.row}>
      <div className={classes.label}>{label}</div>
      <div className={cs(classes.value, { [classes.monospace]: monospace })}>{ value }</div>
    </div>
  );
};
