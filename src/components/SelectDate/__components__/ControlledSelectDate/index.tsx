import { Controller } from "react-hook-form";
import SelectDate from "../..";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { ISelectDateProps } from "../../types";

interface IControlledSelectDateProps<T extends FieldValues> extends ISelectDateProps {
  name: Path<T>;
  control: Control<T>;
}

export const ControlledSelectDate = <T extends FieldValues>({
  name,
  control,
  ...props
}: IControlledSelectDateProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <SelectDate {...props} {...field} />
          {error && <small style={{ color: "#ff0000" }}>{error?.message}</small>}
        </div>
      )}
    />
  );
};
