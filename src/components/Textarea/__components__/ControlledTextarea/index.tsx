import { Controller } from "react-hook-form";
import Textarea from "../..";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { ITextareaProps } from "../../types";

interface IControlledTextareaProps<T extends FieldValues> extends ITextareaProps {
  name: Path<T>;
  control: Control<T>;
}

export const ControlledTextarea = <T extends FieldValues>(props: IControlledTextareaProps<T>) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Textarea {...field} {...props} />
          {error && <small style={{ color: "#ff0000" }}>{error?.message}</small>}
        </div>
      )}
    />
  );
};
