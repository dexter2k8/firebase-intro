import type { TGridColDef } from "../../types";

export type TSort = "asc" | "desc";

export interface ISortProps {
  field: string;
  sort?: TSort;
}

export interface IFilterProps {
  field: string;
  text: string;
}

export interface IHead {
  columns: TGridColDef[];
  colWidths: number[];
  onSort: ({ field, sort }: ISortProps) => void;
  onFilter: ({ field, text }: IFilterProps) => void;
}
