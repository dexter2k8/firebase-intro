import { useEffect, useRef, useState } from "react";
import moment from "moment";
import * as XLSX from "xlsx";
import styles from "./styles.module.scss";
import type { TPostIncome } from "@/app/api/incomes/post-multiple-incomes/types";
import type { IExcelFileProps } from "./types";

interface IExcelReaderProps {
  onFile: (data: Partial<TPostIncome>[]) => void;
}

export default function ExcelReader({ onFile }: IExcelReaderProps) {
  const { reader } = styles;
  const [incomesData, setIncomesData] = useState<IExcelFileProps[]>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (incomesData) {
      const parsedIncomes = incomesData.map((item: IExcelFileProps) => {
        const parsedDate = moment(item?.Pagamento, "DD/MM/YYYY").format("YYYY-MM-DD");
        const parsedAlias = item?.Produto?.split(" ")[0];
        return {
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

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return (
    <div className={reader}>
      <small>Get excel incomes</small>
      <input ref={fileInputRef} type="file" accept=".xlsx, .xls, .csv" onChange={handleFile} />
    </div>
  );
}
