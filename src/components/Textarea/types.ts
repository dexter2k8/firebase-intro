import type { CSSProperties } from "react";

export interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: CSSProperties["resize"];
  rows?: number;
}
