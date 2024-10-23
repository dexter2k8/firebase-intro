import { useEffect, useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import styles from "./styles.module.scss";
import type { IPostIncome } from "@/app/api/incomes/post-multiple-incomes/types";
import type { IExcelFileProps } from "./types";

interface IExcelReaderProps {
  onFile: (data: Partial<IPostIncome>[]) => void;
}

export default function ExcelReader({ onFile }: IExcelReaderProps) {
  const { reader } = styles;
  const [incomesData, setIncomesData] = useState<IExcelFileProps[]>();

  useEffect(() => {
    if (incomesData) {
      const parsedIncomes = incomesData.map((item: IExcelFileProps) => {
        const parsedDate = moment(item.Pagamento, "DD/MM/YYYY").format("YYYY-MM-DD");
        const parsedAlias = item.Produto.split(" ")[0];
        return {
          price: item["Preço unitário"],
          income: item["Valor líquido"],
          updated_at: parsedDate,
          fund_alias: parsedAlias,
        };
      });
      const filteredIncomes = parsedIncomes.filter((item) => item.fund_alias !== "");
      onFile(filteredIncomes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomesData]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setIncomesData(json as IExcelFileProps[]);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  return (
    <div className={reader}>
      <small>Get excel incomes</small>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
    </div>
  );
}
