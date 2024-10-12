export interface ICheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}
