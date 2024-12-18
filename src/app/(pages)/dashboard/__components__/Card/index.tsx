"use client";
import CountUp from "react-countup";
import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import { Tooltip } from "react-tooltip";
import Skeleton from "@/components/Skeleton";
import { formatCurrency } from "@/utils/lib";
import styles from "./styles.module.scss";

interface ICardProps {
  label: string;
  value: number;
  tooltip?: string;
  currency?: boolean;
  decimals?: number;
  suffix?: string;
  difference?: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export default function Card({
  label,
  tooltip,
  value = 0,
  currency,
  decimals = 2,
  suffix,
  difference,
  icon,
  isLoading,
}: ICardProps) {
  const { card, title, diff } = styles;
  const id = Math.random().toString(36).slice(2);
  return (
    <div className={card}>
      <div>
        <div className={title}>
          {icon}
          <h4 data-tooltip-id={id}>{label}</h4>
          {tooltip && (
            <Tooltip id={id} style={{ maxWidth: "18rem" }}>
              {tooltip}
            </Tooltip>
          )}
        </div>
        {isLoading ? (
          <Skeleton height="2rem" width="9rem" />
        ) : (
          <CountUp
            duration={1}
            end={value}
            decimals={decimals}
            decimal=","
            suffix={suffix}
            formattingFn={currency ? formatCurrency : undefined}
          />
        )}
      </div>
      <div
        className={diff}
        style={{ color: difference && difference >= 0 ? "var(--green)" : "var(--red)" }}
      >
        {isLoading ? (
          <>
            {/* eslint-disable-next-line no-irregular-whitespace */}
            <div> </div>
            <Skeleton height="1.25rem" width="2rem" />
          </>
        ) : (
          <>
            {!difference ? null : difference >= 0 ? (
              <MdOutlineArrowDropUp size="1.25rem" />
            ) : (
              <MdOutlineArrowDropDown size="1.25rem" />
            )}
            {difference && <small>{difference}%</small>}
          </>
        )}
      </div>
    </div>
  );
}
