import { Controller } from "react-hook-form";
import { formatBRL } from "@/utils/lib";
import Input from "../Input";
import type { ChangeEvent } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import type { IInputProps } from "../Input";

interface IControlledInputProps<T extends FieldValues> extends Omit<IInputProps, "onChange"> {
  name: Path<T>;
  control: Control<T>;
  rawValue?: (value: string) => void;
}

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  const txt = e.target.value;
  return "R$" + formatBRL(txt).value;
};

export const InputCurrency = <T extends FieldValues>({
  name,
  control,
  ...props
}: IControlledInputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input
          type="search"
          {...field}
          {...props}
          message={error?.message}
          status={error ? "error" : undefined}
          onChange={(e) => field.onChange(handleChange(e))}
          value={field.value ?? ""}
        />
      )}
    />
  );
};
