export interface IResponse<T> {
  data: T[];
  count: number;
}

export type TFundType = "Ação" | "FII" | "BDR";
