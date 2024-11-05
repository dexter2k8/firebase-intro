import type { IGetIncomeByFund } from "@/app/api/incomes/get-incomes-by-fund/[alias]/types";
import type { ISelectOptions } from "@/components/Select/types";

export interface IIncomesTableProps {
  fundList: ISelectOptions[];
  isLoadingProfits: boolean;
  profits: IGetIncomeByFund[];
  onMutate: () => void;
  fund_alias?: string;
  fundValue?: number;
}
