import { formatCurrency, formatDate } from "@/utils/lib";
import styles from "./styles.module.scss";
import type { ITransactionByFund } from "@/app/api/transactions/get-transactions-by-fund/[alias]/types";

interface ITransactionCardProps {
  transactions: ITransactionByFund[];
  onCardClick: (id: string) => void;
}

export default function TransactionCard({ transactions, onCardClick }: ITransactionCardProps) {
  const { content, left, right, tag } = styles;

  return (
    <>
      {transactions?.map((transaction, i) => {
        const type = transaction.quantity < 0 ? "sell" : "buy";
        const total = formatCurrency(Math.abs(transaction.quantity) * transaction.price);
        return (
          <li key={i} className={content} onClick={() => onCardClick(transaction.id)}>
            <div className={left}>
              <p>
                {Math.abs(transaction.quantity)} x {formatCurrency(transaction.price)}
              </p>
              <small
                className={tag}
                style={{ backgroundColor: type === "buy" ? "var(--green)" : "var(--red)" }}
              >
                {type}
              </small>
            </div>
            <div className={right}>
              <b>{total}</b>
              <small>{formatDate(transaction.bought_at)}</small>
            </div>
          </li>
        );
      })}
    </>
  );
}
