import type { IGetIncomesFundResponse } from "@/app/api/get_incomes_fund/[fund]/types";
import type { ISelectOptions } from "@/components/Select/types";

export interface ILineChartProps {
  fundList: ISelectOptions[];
  profits: IGetIncomesFundResponse[];
  isLoading: boolean;
}
