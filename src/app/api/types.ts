export interface IResponse<T> {
  data: T[];
  csvData?: T[];
  count: number;
}

export type TFundType = "Ação" | "FII" | "BDR";
