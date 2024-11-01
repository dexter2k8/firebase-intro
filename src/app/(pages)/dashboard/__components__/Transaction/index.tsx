import { Tooltip } from "react-tooltip";
import { formatCurrency, formatDate } from "@/utils/lib";
import styles from "./styles.module.scss";
import type { ITransactions } from "@/app/api/get_transactions/types";

export default function Transaction(props: ITransactions) {
  const { transaction, head, content, left, right, alias, tag, stats } = styles;

  const type = props.quantity < 0 ? "sell" : "buy";

  return (
    <div className={transaction}>
      <p
        data-tooltip-id="transaction-tooltip"
        data-tooltip-content={props.description}
        className={head}
      >
        {props.name}
      </p>
      <Tooltip id="transaction-tooltip" style={{ maxWidth: "18rem" }} />

      <div className={content}>
        <div className={left}>
          <small className={alias}>{props.fund_alias}</small>
          <div className={stats}>
            <p>{Math.abs(props.quantity)}x</p>
            <small
              className={tag}
              style={{ backgroundColor: type === "buy" ? "var(--green)" : "var(--red)" }}
            >
              {type}
            </small>
          </div>
        </div>
        <div className={right}>
          <b>{formatCurrency(props.price)}</b>
          <small>{formatDate(props.bought_at)}</small>
        </div>
      </div>
    </div>
  );
}
