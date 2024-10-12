export interface ISelectOptions {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface ISelectProps {
  options: ISelectOptions[];
  id?: string;
  value?: string;
  type?: TTypes;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

type TTypes = "default" | "search";
