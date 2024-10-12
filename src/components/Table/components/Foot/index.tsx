import "./styles.css";
import type { IFoot } from "./types";

export default function Foot({ page, colCount, rowCount, pageSize, onPageChange }: IFoot) {
  const min = 1 + (page - 1) * pageSize;
  const max = page * pageSize < rowCount ? page * pageSize : rowCount;

  const rightLimit = max < rowCount;
  const leftLimit = min > 1;

  return (
    <tr>
      <td className="ds-table__footer" colSpan={colCount}>
        <span>
          {min} - {max} of {rowCount}
        </span>
        <span
          className={`ds-table__footer--arrow-${leftLimit}`}
          onClick={() => onPageChange(page - 1)}
        >
          &lt;
        </span>
        <span
          className={`ds-table__footer--arrow-${rightLimit}`}
          onClick={() => onPageChange(page + 1)}
        >
          &gt;
        </span>
      </td>
    </tr>
  );
}
