import type { IGetIncomesFundResponse } from "@/app/api/get_incomes_fund/[fund]/types";

export default function chartOptions(profits: IGetIncomesFundResponse[]) {
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
