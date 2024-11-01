import { formatCurrency } from "@/utils/lib";
import type { IDonutOptions } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatParams = (params: any) => {
  return `${params.marker} ${params.name}: <b>${formatCurrency(params.value)}</b> (${
    params.percent
  }%)`;
};

export default function chartOptions({ data, colors }: IDonutOptions) {
  const options: echarts.EChartsOption = {
    tooltip: {
      trigger: "item",
      align: "center",
      formatter: formatParams,
    },
    legend: {
      top: 8,
      left: "center",
    },
    series: [
      {
        top: "-10%",
        bottom: "-20%",
        type: "pie",
        radius: ["37%", "60%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        color: colors,
        data: data,
      },
    ],
  };

  return options;
}
