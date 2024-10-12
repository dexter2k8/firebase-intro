import { Controller } from "react-hook-form";
import Select from "../..";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { ISelectProps } from "../../types";

interface IControlledSelectProps<T extends FieldValues> extends ISelectProps {
  name: Path<T>;
  control: Control<T>;
}

export const ControlledSelect = <T extends FieldValues>({
  name,
  control,
  ...props
}: IControlledSelectProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <Select {...field} {...props} />
          {error && <small style={{ color: "#ff0000" }}>{error?.message}</small>}
        </div>
      )}
    />
  );
};
