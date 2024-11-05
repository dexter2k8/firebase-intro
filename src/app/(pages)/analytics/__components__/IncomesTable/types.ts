import type { IGetIncomesFundResponse } from "@/app/api/get_incomes_fund/[fund]/types";
import type { ISelectOptions } from "@/components/Select/types";

export interface IIncomesTableProps {
  fundList: ISelectOptions[];
  isLoadingProfits: boolean;
  profits: IGetIncomesFundResponse[];
  onMutate: () => void;
  fund_alias?: string;
  fundValue?: number;
}
