import type { TFundType } from "../../types";

export interface IFund {
  alias: string;
  name: string;
  type: TFundType;
  description?: string;
}
