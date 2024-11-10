"use client";
import { useEffect, useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import InfiniteScroll from "react-infinite-scroll-component";
import ExportCSV from "@/app/(pages)/__components__/CsvExport";
import LayoutCharts from "@/app/(pages)/dashboard/__components__/Charts/layout";
import Skeleton from "@/components/Skeleton";
import { useSWR } from "@/hook/useSWR";
import { API } from "@/utils/paths";
import TransactionCard from "./__components__/TransactionCard";
import TransactionModal from "./__components__/TransactionModal";
import type { ITransactionByFund } from "@/app/api/transactions/get-transactions-by-fund/[alias]/types";
import type { IResponse } from "@/app/api/types";

interface IInfiniteListProps {
  fund_alias: string;
  fundValue?: number;
}

export default function Transactions({ fund_alias, fundValue }: IInfiniteListProps) {
  const [hasMore, setHasMore] = useState(true);
  const [idModal, setIdModal] = useState<string>();
  const [displayedItems, setDisplayedItems] = useState<ITransactionByFund[]>([]);

  const { response: transactionsByFund, mutate } = useSWR<IResponse<ITransactionByFund>>(
    fund_alias ? API.TRANSACTIONS.GET_TRANSACTIONS_BY_FUND + fund_alias : undefined
  );

  useEffect(() => {
    setDisplayedItems(transactionsByFund?.data.slice(0, 5));
    if (transactionsByFund?.count <= 5) setHasMore(false);
  }, [transactionsByFund]);

  const fetchMoreData = () => {
    if (displayedItems?.length >= transactionsByFund?.count) {
      setHasMore(false);
      return;
    }
    // Simula a adição de mais 5 itens ou os restantes
    const nextItems = transactionsByFund?.data.slice(
      displayedItems?.length,
      displayedItems?.length + 5
    );
    setDisplayedItems((prevItems) => [...prevItems, ...nextItems]);
  };

  const skeletons = Array.from({ length: 3 }, (_, index) => <Skeleton key={index} height={60} />);

  return (
    <LayoutCharts
      title="Transactions"
      sideControls={
        <div style={{ display: "flex", gap: "1rem" }}>
          <ExportCSV table="transactions" fileName="transactions.csv" />
          <CiSquarePlus size="2rem" onClick={() => setIdModal("")} style={{ cursor: "pointer" }} />
        </div>
      }
    >
      <InfiniteScroll
        dataLength={displayedItems?.length || 0}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={skeletons}
        height="12rem"
      >
        <TransactionCard onCardClick={setIdModal} transactions={displayedItems} />
      </InfiniteScroll>

      <TransactionModal
        open={idModal !== undefined}
        transaction={transactionsByFund?.data.find((t) => t.id === idModal)}
        onClose={() => setIdModal(undefined)}
        onMutate={mutate}
        fund_alias={fund_alias}
        fundValue={fundValue}
      />
    </LayoutCharts>
  );
}
