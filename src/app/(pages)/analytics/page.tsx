"use client";
import dynamic from "next/dynamic";
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
import type { IFundDetailsResponse } from "@/app/api/funds/get-fund-details/[alias]/types";
import type { IFund } from "@/app/api/funds/get-funds/types";
import type { IGetIncomeByFund } from "@/app/api/incomes/get-incomes-by-fund/[alias]/types";
import type { IResponse } from "@/app/api/types";
import type { ISelectOptions } from "@/components/Select/types";

function Analytics() {
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

  const { response: details, isLoading: isLoadingDetails } = useSWR<{ data: IFundDetailsResponse }>(
    fund ? API.FUNDS.GET_FUND_DETAILS + fund : undefined
  );

  return (
    <div className={analytics}>
      <main>
        <section className={cards}>
          <Card
            label="Price"
            tooltip="Current price of the fund. The price is the market value of the fund's assets."
            icon={<AiFillDollarCircle style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
            value={details?.data.price}
            currency
            difference={details?.data.variation}
            isLoading={isLoadingDetails}
          />
          {details?.data.pvp && (
            <Card
              label="P/VP"
              tooltip="Price to book value (P/VP). P/VP is a ratio that compares a company's price to its book value, which is the value of its assets minus its liabilities."
              icon={<RiExchangeFundsFill style={{ color: "var(--blue)", fontSize: "1.5rem" }} />}
              value={details?.data.pvp}
              isLoading={isLoadingDetails}
            />
          )}
          <Card
            label="DY (12M)"
            tooltip="Dividend Yield (12 Months). Dividend yield is a measure of a company's ability to pay dividends to shareholders."
            icon={<FaArrowUpRightDots style={{ color: "var(--blue)", fontSize: "1.25rem" }} />}
            value={details?.data.dy}
            suffix="%"
            isLoading={isLoadingDetails}
          />
          <Card
            label="EPS (12M)"
            tooltip="Earnings per share (12 months). Represents a company's total net income over the past 12 months, divided by the total number of shares outstanding."
            icon={<FaArrowTrendUp style={{ color: "var(--blue)", fontSize: "1.25rem" }} />}
            value={details?.data.eps}
            suffix="%"
            isLoading={isLoadingDetails}
          />
        </section>

        <section className={charts}>
          <PatrimonialEvolution
            fundList={funds || []}
            profits={reverseIncomesByFund}
            isLoading={isLoadingIncomesByFund}
          />
          <Transactions fund_alias={fund} fundValue={details?.data.price} />
        </section>

        <section className={table}>
          <IncomesTable
            fundList={funds || []}
            profits={incomesByFund?.data || []}
            isLoadingProfits={isLoadingIncomesByFund}
            onMutate={mutate}
            fund_alias={fund}
            fundValue={details?.data.price}
          />
        </section>
      </main>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Analytics));
