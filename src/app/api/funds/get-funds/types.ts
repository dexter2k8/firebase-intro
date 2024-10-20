export type TFundType = "Ação" | "FII" | "BDR";

export interface IFunds {
  alias: string;
  name: string;
  type: TFundType;
  description?: string;
}

export interface IFundsResponse {
  data: IFunds[];
  count: number;
}
