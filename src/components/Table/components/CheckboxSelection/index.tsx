import { useState } from "react";
import Checkbox from "./Checkbox";
import type { ICheckboxSelectionProps } from "./types";

export default function CheckboxSelection({
  columns,
  rows,
  checkboxSelection,
}: ICheckboxSelectionProps) {
  const [checked, setChecked] = useState<number[]>([]);

  const indeterminate = checked.length > 0 && checked.length < rows.length;
  const selectAll = Array.from({ length: rows.length }, (_, i) => i);

  const handleOptionChange = (index: number, isChecked: boolean) => {
    const nextSelected = isChecked ? [...checked, index] : checked.filter((t) => t !== index);

    setChecked(nextSelected);
  };

  const handleGroupChange = () => setChecked(checked.length ? [] : selectAll);

  const checkboxColumn = [
    {
      field: "_",
      label: (
        <Checkbox
          indeterminate={indeterminate}
          checked={checked.length > 0}
          onChange={handleGroupChange}
        />
      ) as unknown as string,
    },
    ...columns,
  ];

  const checkboxRows = rows.map((row, i) => {
    return {
      _: (
        <Checkbox
          id={String(i)}
          checked={checked.includes(i)}
          onChange={(e) => handleOptionChange(i, e.target.checked)}
        />
      ),
      ...row,
    };
  });
  const parsedColumns = checkboxSelection ? checkboxColumn : columns;
  const parsedRows = checkboxSelection ? checkboxRows : rows;

  return { parsedRows, parsedColumns, checked };
}
