import { MdOutlineArrowDropDown, MdOutlineArrowDropUp } from "react-icons/md";
import TableActions from "@/components/TableActions";
import { formatCurrency, formatDate } from "@/utils/lib";
import type { IGetIncomesFundResponse } from "@/app/api/get_incomes_fund/[fund]/types";
import type { GridColDef } from "@/components/Table/types";
import type { IActions } from "@/components/TableActions/types";

export function getColumns({ onAction }: IActions) {
  const columns: GridColDef<IGetIncomesFundResponse>[] = [
    {
      field: "updated_at",
      label: "DATE",
      sortable: true,
      render: (value) => <p>{formatDate(String(value))}</p>,
    },
    { field: "price", label: "PRICE", render: (value) => <p>{formatCurrency(Number(value))}</p> },
    { field: "quantity", label: "QUANTITY" },
    {
      field: "patrimony",
      label: "PATRIMONY",
      render: (value) => <p>{formatCurrency(Number(value))}</p>,
    },
    {
      field: "variation",
      label: "VARIATION",
      render: (value) => {
        const color = Number(value) > 0 ? "var(--green)" : "var(--red)";
        const arrow =
          Number(value) >= 0 ? (
            <MdOutlineArrowDropUp size="1.25rem" />
          ) : (
            <MdOutlineArrowDropDown size="1.25rem" />
          );
        return (
          <div style={{ color, display: "flex", alignItems: "center" }}>
            {formatCurrency(Number(value))}
            {value && arrow}
          </div>
        );
      },
    },
    { field: "income", label: "INCOME", render: (value) => <p>{formatCurrency(Number(value))}</p> },
    {
      field: "pvp",
      label: "P/VP",
      render: (value) => <p>{Number(value).toFixed(2)}%</p>,
    },
    {
      field: "actions" as keyof IGetIncomesFundResponse,
      label: "ACTIONS",
      valueGetter: (row) => row.id,
      render: (value) => <TableActions id={value} onAction={onAction} />,
    },
  ];

  return columns;
}
