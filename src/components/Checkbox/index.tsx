import "./styles.css";
import type { ICheckboxProps } from "./types";

export default function Checkbox({ indeterminate = false, ...props }: ICheckboxProps) {
  return (
    <input
      className={`ds-checkbox ${indeterminate ? "ds-checkbox-indeterminate" : ""}`}
      type="checkbox"
      {...props}
    />
  );
}
