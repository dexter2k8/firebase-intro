"use client";
import dynamic from "next/dynamic";
import SegmentedControl from "@/components/SegmentedControl";
import Skeleton from "@/components/Skeleton";
import chartOptions from "./options";
import { segmentedRange } from "../../../types";
import LayoutCharts from "../layout";
import styles from "./styles.module.scss";
import type { CSSProperties } from "react";
import type { IVerticalBarsProps } from "./types";

const Charts = dynamic(() => import("echarts-for-react"));

export default function VerticalBars({ data = [], selectedRange, isLoading }: IVerticalBarsProps) {
  const { container, content } = styles;
  const options = chartOptions(data);
  const calcWidth = data.length * 2.5;
  const widthStyle = { "--min-width": `${calcWidth}rem` };

  return (
    <div>
      <LayoutCharts
        title="Portfolio over time"
        sideControls={
          <SegmentedControl onSelect={selectedRange} defaultSelected={3} items={segmentedRange} />
        }
      >
        {isLoading ? (
          <Skeleton height="18rem" />
        ) : (
          <div className={container}>
            <div className={content} style={widthStyle as CSSProperties}>
              <Charts option={options} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>
        )}
      </LayoutCharts>
    </div>
  );
}
