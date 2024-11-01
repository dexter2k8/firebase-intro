"use client";
import { useState } from "react";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaHandHoldingDollar } from "react-icons/fa6";
import SegmentedControl from "@/components/SegmentedControl";
import { useSWR } from "@/hook/useSWR";
import { API } from "@/utils/paths";
import { endDate, getDate, patrimonyColors, profitColors, segmentedTypes } from "./types";
import Card from "./__components__/Card";
import Donut from "./__components__/Charts/Donut";
import VerticalBars from "./__components__/Charts/VerticalBars";
import styles from "./styles.module.scss";
import type { IGetSelfProfitsResponse } from "@/app/api/incomes/get-portfolio/types";
import type { IGetIncomesResponse } from "@/app/api/incomes/get-portfolio-by-type/types";

export default function Dashboard() {
  const { dashboard, cards, segmented } = styles;
  const [range, setRange] = useState(3);
  const [type, setType] = useState(1);

  const { response: portfolio, isLoading: isLoadingPortfolio } = useSWR<IGetSelfProfitsResponse>(
    API.INCOMES.GET_PORTFOLIO,
    {
      initDate: getDate(range),
      endDate,
      type: type === 1 ? "" : segmentedTypes[type - 1].label,
    }
  );

  const { response: portfolioByType, isLoading: isLoadingPortfolioByType } =
    useSWR<IGetIncomesResponse>(API.INCOMES.GET_PORTFOLIO_BY_TYPE);

  return (
    <div className={dashboard}>
      <main>
        <div className={segmented}>
          <SegmentedControl
            defaultSelected={1}
            onSelect={setType}
            variant="secondary"
            items={segmentedTypes}
          />
        </div>
        <section className={cards}>
          <Card
            label="Patrimony"
            icon={<AiFillDollarCircle style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
            value={portfolio?.patrimony.value ?? 0}
            currency
            difference={portfolio?.patrimony.difference ?? 0}
            isLoading={isLoadingPortfolio}
          />
          <Card
            label="Last Profits"
            icon={
              <FaHandHoldingDollar
                style={{ color: "var(--green)", fontSize: "1.25rem", marginBottom: "0.25rem" }}
              />
            }
            value={portfolio?.profit.value ?? 0}
            currency
            difference={portfolio?.profit.difference ?? 0}
            isLoading={isLoadingPortfolio}
          />
        </section>

        <section>
          <VerticalBars
            selectedRange={setRange}
            data={portfolio?.data}
            isLoading={isLoadingPortfolio}
          />
        </section>

        <section className={cards}>
          <Donut
            title="Patrimony"
            data={portfolioByType?.patrimony}
            isLoading={isLoadingPortfolioByType}
            colors={patrimonyColors}
          />
          <Donut
            title="Profits"
            data={portfolioByType?.profit}
            isLoading={isLoadingPortfolioByType}
            colors={profitColors}
          />
        </section>
      </main>
    </div>
  );
}
