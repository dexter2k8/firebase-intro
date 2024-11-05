export interface IGetIncomeByFund {
  id: string;
  price: number;
  updated_at: string;
  income: number;
  fund_alias: string;
  user_id: string;
  quantity: number;
  patrimony: number;
  variation: number | null;
  pvp: number;
}
