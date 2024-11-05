import type { IGetIncomeByFund } from "@/app/api/incomes/get-incomes-by-fund/[alias]/types";

export default function chartOptions(profits: IGetIncomeByFund[]) {
  const options: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
    },
    grid: { top: "10%", left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: {
      type: "category",
      data: profits.map((el) => el.updated_at),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: profits.map((el) => el.patrimony),
        type: "line",
        showSymbol: false,
      },
    ],
  };

  return options;
}
