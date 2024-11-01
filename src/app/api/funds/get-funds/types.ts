export type TFundType = "Ação" | "FII" | "BDR";

export interface IFund {
  alias: string;
  name: string;
  type: TFundType;
  description?: string;
}
