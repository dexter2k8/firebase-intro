"use client";
import dynamic from "next/dynamic";
import Skeleton from "@/components/Skeleton";
import chartOptions from "./options";
import LayoutCharts from "../layout";
import type { IDonutProps } from "./types";

const Charts = dynamic(() => import("echarts-for-react"));

export default function Donut({ title, data, colors, isLoading }: IDonutProps) {
  const options = chartOptions({ data, colors });

  return (
    <LayoutCharts title={title}>
      {isLoading ? <Skeleton height="18rem" /> : <Charts option={options} />}
    </LayoutCharts>
  );
}
