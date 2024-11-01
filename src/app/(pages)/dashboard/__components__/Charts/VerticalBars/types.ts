import type { IGetSelfProfits } from "@/app/api/incomes/get-portfolio/types";

export interface IVerticalBarsProps {
  data: IGetSelfProfits[];
  selectedRange: (key: number) => void;
  isLoading: boolean;
}
