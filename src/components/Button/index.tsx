import "./styles.css";
import type { IButtonProps } from "./types";

export default function Button({
  children,
  variant = "default",
  size = "default",
  loading = false,
  ...props
}: IButtonProps) {
  const buttonClasses = ["ds-button"];
  if (variant === "primary") buttonClasses.push("ds-button-primary");
  if (variant === "link") buttonClasses.push("ds-button-link");
  if (size === "small") buttonClasses.push("ds-button-small");
  if (size === "large") buttonClasses.push("ds-button-large");
  if (loading) buttonClasses.push("ds-button-loading");
  const buttonClass = buttonClasses.join(" ");

  return (
    <button className={buttonClass} {...props}>
      {loading && (
        <div className="ds-loading">
          <span />
        </div>
      )}
      <p>{children}</p>
    </button>
  );
}
