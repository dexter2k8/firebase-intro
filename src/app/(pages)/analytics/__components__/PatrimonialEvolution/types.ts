import type { IGetIncomeByFund } from "@/app/api/incomes/get-incomes-by-fund/[alias]/types";
import type { ISelectOptions } from "@/components/Select/types";

export interface ILineChartProps {
  fundList: ISelectOptions[];
  profits: IGetIncomeByFund[];
  isLoading: boolean;
}
