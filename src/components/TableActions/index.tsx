import { CiSquareMinus } from "react-icons/ci";
import { RiListSettingsLine } from "react-icons/ri";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.scss";
import type { IActions } from "./types";

interface ITableActionsProps extends IActions {
  id: string | number;
}

export default function TableActions({ id, onAction }: ITableActionsProps) {
  return (
    <div className={styles.actions}>
      <span
        data-tooltip-id="income-tooltip"
        data-tooltip-content="Edit income"
        onClick={() => onAction({ action: "edit", id })}
      >
        <RiListSettingsLine size="1rem" />
      </span>
      <Tooltip id="income-tooltip" />
      <span
        data-tooltip-id="delete-tooltip"
        data-tooltip-content="Delete income"
        onClick={() => onAction({ action: "delete", id })}
      >
        <CiSquareMinus size="1rem" style={{ color: "var(--red)" }} />
      </span>
      <Tooltip id="delete-tooltip" />
    </div>
  );
}
