"use client";
import { useQueryState } from "nuqs";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaArrowTrendUp, FaArrowUpRightDots } from "react-icons/fa6";
import { RiExchangeFundsFill } from "react-icons/ri";
import { useSWR } from "@/hook/useSWR";
import { API } from "@/utils/paths";
import Card from "../dashboard/__components__/Card";
import IncomesTable from "./__components__/IncomesTable";
import PatrimonialEvolution from "./__components__/PatrimonialEvolution";
import Transactions from "./__components__/Transactions";
import styles from "./styles.module.scss";
import type { IFund } from "@/app/api/funds/get-funds/types";
import type { IScrapeResponse } from "@/app/api/get-scrape/types";
import type { IGetIncomeByFund } from "@/app/api/incomes/get-incomes-by-fund/[alias]/types";
import type { IResponse } from "@/app/api/types";
import type { ISelectOptions } from "@/components/Select/types";

export default function Analytics() {
  const { analytics, charts, table, cards } = styles;

  const { response: selfFunds } = useSWR<IResponse<IFund>>(API.FUNDS.GET_SELF_FUNDS);

  const [fund] = useQueryState("fund", { defaultValue: selfFunds?.data[0]?.alias });

  const funds: ISelectOptions[] = selfFunds?.data.map((fund) => ({
    value: fund.alias,
    label: fund.alias,
  }));

  const {
    response: incomesByFund,
    isLoading: isLoadingIncomesByFund,
    mutate,
  } = useSWR<IResponse<IGetIncomeByFund>>(
    fund ? API.INCOMES.GET_INCOMES_BY_FUND + fund : undefined
  );

  const reverseIncomesByFund = incomesByFund?.data.slice().reverse();

  const fundType = selfFunds?.data.find((f) => f.alias === fund)?.type;

  const { response: scrape, isLoading: isLoadingScrape } = useSWR<IScrapeResponse>(
    fundType && API.GET_SCRAPE,
    {
      fund_alias: fund,
      type: fundType,
    }
  );

  return (
    <div className={analytics}>
      <main>
        <section className={cards}>
          <Card
            label="Value"
            icon={<AiFillDollarCircle style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
            value={scrape?.value}
            currency
            difference={scrape?.valueGrowth}
            isLoading={isLoadingScrape}
          />
          {scrape?.pvp && (
            <Card
              label="P/VP"
              icon={<RiExchangeFundsFill style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
              value={scrape?.pvp}
              isLoading={isLoadingScrape}
            />
          )}
          <Card
            label="DY"
            icon={<FaArrowUpRightDots style={{ color: "var(--blue)", fontSize: "1.25rem" }} />}
            value={scrape?.dy}
            suffix="%"
            isLoading={isLoadingScrape}
          />
          <Card
            label="Valuing (12M)"
            icon={<FaArrowTrendUp style={{ color: "var(--blue)", fontSize: "1.25rem" }} />}
            value={scrape?.growth}
            suffix="%"
            isLoading={isLoadingScrape}
          />
        </section>

        <section className={charts}>
          <PatrimonialEvolution
            fundList={funds || []}
            profits={reverseIncomesByFund}
            isLoading={isLoadingIncomesByFund}
          />
          <Transactions fund_alias={fund} fundValue={scrape?.value} />
        </section>

        <section className={table}>
          <IncomesTable
            fundList={funds || []}
            profits={incomesByFund?.data || []}
            isLoadingProfits={isLoadingIncomesByFund}
            onMutate={mutate}
            fund_alias={fund}
            fundValue={scrape?.value}
          />
        </section>
      </main>
    </div>
  );
}
