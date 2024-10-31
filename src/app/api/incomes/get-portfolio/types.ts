export interface IGetSelfProfits {
  year_month: string;
  total_patrimony: number;
  total_income: number;
}

export interface IGetSelfProfitsResponse {
  data: IGetSelfProfits[];
  patrimony: {
    value: number;
    difference: number;
  };
  profit: {
    value: number;
    difference: number;
  };
}
