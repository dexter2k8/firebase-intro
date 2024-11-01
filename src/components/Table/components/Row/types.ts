import type { TGridColDef, TRowModel } from "../../types";

export interface IRow {
  columns: TGridColDef[];
  colWidths: number[];
  row: TRowModel;
  rowIndex: number;
  checked: number[];
  checkboxSelection?: boolean;
  rowClick?: (row: number) => void;
}
