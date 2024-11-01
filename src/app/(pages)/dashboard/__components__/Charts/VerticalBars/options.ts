import { formatCurrency } from "@/utils/lib";
import type { IGetSelfProfits } from "@/app/api/get_self_profits/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatParams = (params: any) => {
  let content = `${params[0].axisValue}<br/>`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params.forEach((item: any) => {
    content += `${item.marker} ${item.seriesName}: <b>${formatCurrency(item.value)}</b><br/>`;
  });
  return content;
};

export default function chartOptions(data: IGetSelfProfits[]) {
  const options: echarts.EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: formatParams,
    },
    legend: {
      top: 8, // Move legend 8px down
    },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    xAxis: [
      {
        type: "category",
        data: data.map((el) => el.year_month),
        axisLabel: { rotate: 45 },
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: [
      {
        name: "Patrimony",
        type: "bar",
        stack: "Portfolio",
        emphasis: {
          focus: "series",
        },
        data: data.map((el) => el.total_patrimony),
        color: "#29B6F5",
      },
      {
        name: "Profit",
        type: "bar",
        stack: "Portfolio",
        emphasis: {
          focus: "series",
        },
        data: data.map((el) => el.total_income),
        color: "#8AD562",
      },
    ],
  };

  return options;
}
