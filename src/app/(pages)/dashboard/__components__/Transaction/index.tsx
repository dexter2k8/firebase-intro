import { Tooltip } from "react-tooltip";
import { formatCurrency, formatDate } from "@/utils/lib";
import styles from "./styles.module.scss";
import type { ITransaction } from "@/app/api/transactions/get-transactions/types";

export default function Transaction(props: ITransaction) {
  const { transaction, head, content, left, right, alias, tag, stats } = styles;

  const type = props.quantity < 0 ? "sell" : "buy";

  return (
    <div className={transaction}>
      <div className={head}>
        <p data-tooltip-id="transaction-tooltip" data-tooltip-content={props.description}>
          {props.name}
        </p>
        <small>{formatDate(props.bought_at)}</small>
        <Tooltip id="transaction-tooltip" style={{ maxWidth: "18rem" }} />
      </div>

      <div className={content}>
        <div className={left}>
          <small className={alias}>{props.fund_alias}</small>
          <div className={stats}>
            <small
              className={tag}
              style={{ backgroundColor: type === "buy" ? "var(--green)" : "var(--red)" }}
            >
              {type}
            </small>
          </div>
        </div>
        <div className={right}>
          <small>
            {Math.abs(props.quantity)}x {formatCurrency(props.price)}
          </small>
          <b>{formatCurrency(props.price * props.quantity)}</b>
        </div>
      </div>
    </div>
  );
}
