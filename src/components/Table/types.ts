import type { IFilterProps, ISortProps } from "./components/Head/types";

export type TRowModel = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string | symbol]: any;
};

export interface IGridBaseColDef<T extends TRowModel = TRowModel> {
  field: keyof T; // Field of the row.
  label?: string; // Label of the column.
  width?: string | number; // Width of the column.
  fixed?: "left" | "right"; // Fixed position of the column.
  sortable?: boolean; // Allow to sort the column.
  filterable?: boolean; // Allow to filter the column.
  align?: "left" | "right" | "center"; // Alignment of the column.
  valueGetter?: (row: T) => T[keyof T]; // Function that allows to get a specific data instead of field to render in the cell.
  render?: (value: T[keyof T]) => React.ReactNode; // Allows to override the component rendered as cell for this column.
  renderHeader?: (value: T[keyof T]) => React.ReactNode; // Allows to render a component in the column header cell.
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GridColDef<R extends TRowModel = any> = IGridBaseColDef<R>;

export interface ITable {
  columns: GridColDef[];
  rows: TRowModel[];
  isLoading?: boolean;
  onRowClick?: (row: TRowModel) => void;
  pageSize?: number; // How many rows should be shown at once.
  checkboxSelection?: boolean; // Show checkboxes to select rows
  checkboxSelected?: (rows: TRowModel[]) => void; // Works only with checkboxSelection = true
  serverPagination?: boolean; // Activates server side pagination
  serverRowCount?: number; // Works only with serverPagination = true. Receives the total number of rows in the server.
  serverPage?: number; // Works only with serverPagination = true. Receives the current page number.
  serverPageChange?: (page: number) => void; // Works only with serverPagination = true. Return page changed event of footer controls.
  serverFiltered?: ({ field, text }: IFilterProps) => void; // Return field and input text to filter on server side.
  serverSorted?: ({ field, sort }: ISortProps) => void; // Return field and sort (asc, desc or undefined) to sort on server side.
  hideFooter?: boolean;
}
