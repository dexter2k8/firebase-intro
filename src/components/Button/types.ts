export type TButtonVariant = "default" | "primary" | "link";
export type TButtonSize = "small" | "default" | "large";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: TButtonVariant;
  size?: TButtonSize;
  loading?: boolean;
}
