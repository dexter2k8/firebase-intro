import styles from "./styles.module.scss";
import type { PropsWithChildren } from "react";

interface IChartCardProps {
  title: string;
  sideControls?: React.ReactNode;
}

export default function LayoutCharts({
  title,
  children,
  sideControls,
}: PropsWithChildren<IChartCardProps>) {
  const { charts, head } = styles;

  return (
    <div className={charts}>
      <div className={head}>
        <h4>{title}</h4>
        {sideControls}
      </div>
      {children}
    </div>
  );
}
