import type { TFundType } from "../../types";

export interface ITransaction {
  id: string;
  bought_at: string;
  price: number;
  quantity: number;
  fund_alias: string;
  user_id: string;
  type: TFundType;
  description: string;
  name: string;
}
