import type { GridColDef, TRowModel } from "../../types";

export interface IRow {
  columns: GridColDef[];
  colWidths: number[];
  row: TRowModel;
  rowIndex: number;
  checked: number[];
  checkboxSelection?: boolean;
  rowClick?: (row: number) => void;
}
