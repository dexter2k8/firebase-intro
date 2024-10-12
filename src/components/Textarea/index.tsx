import "./styles.css";
import { forwardRef } from "react";
import { ControlledTextarea } from "./__components__/ControlledTextarea";
import type { FC } from "react";
import type { ITextareaProps } from "./types";

const TextareaBasic: FC<ITextareaProps> = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ resize, ...props }, ref) => {
    return <textarea className="dx-textarea" ref={ref} {...props} style={{ resize }} />;
  }
);

TextareaBasic.displayName = "TextareaBasic";

const Textarea = TextareaBasic as FC<ITextareaProps> & {
  Controlled: typeof ControlledTextarea;
};

Textarea.Controlled = ControlledTextarea;

export default Textarea;
