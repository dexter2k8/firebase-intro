"use client";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaArrowTrendUp, FaArrowUpRightDots } from "react-icons/fa6";
import { RiExchangeFundsFill } from "react-icons/ri";
import { useSWR } from "@/hook/useSWR";
import { API } from "@/utils/paths";
import Card from "../dashboard/__components__/Card";
import styles from "./styles.module.scss";

export default function Analytics() {
  const {
    analytics,
    // charts,
    // table,
    cards,
  } = styles;

  const { response: selfFunds } = useSWR(API.FUNDS.GET_SELF_FUNDS);

  console.log(selfFunds);

  return (
    <div className={analytics}>
      <main>
        <section className={cards}>
          <Card
            label="Value"
            icon={<AiFillDollarCircle style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
            value={100}
            // value={indicators?.value}
            currency
            difference={10}
            // difference={indicators?.valueGrowth}
            // isLoading={isLoadingIndicators}
          />
          {/* {indicators?.pvp && ( */}
          <Card
            label="P/VP"
            icon={<RiExchangeFundsFill style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
            value={1.25}
            // value={indicators?.pvp}
            // isLoading={isLoadingIndicators}
          />
          {/* )} */}
          <Card
            label="DY"
            icon={<FaArrowUpRightDots style={{ color: "var(--blue)", fontSize: "1.25rem" }} />}
            value={10}
            // value={indicators?.dy}
            suffix="%"
            // isLoading={isLoadingIndicators}
          />
          <Card
            label="Valuing (12M)"
            icon={<FaArrowTrendUp style={{ color: "var(--blue)", fontSize: "1.25rem" }} />}
            value={15}
            // value={indicators?.growth}
            suffix="%"
            // isLoading={isLoadingIndicators}
          />
        </section>
      </main>
    </div>
  );
}
