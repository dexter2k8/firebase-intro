export interface IFoot {
  colCount: number;
  rowCount: number;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
}
