import { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import Button from "@/components/Button";
import api from "@/services/api";
import { API } from "@/utils/paths";
import type { IIncome } from "@/app/api/incomes/get-incomes/types";
import type { IResponse } from "@/app/api/types";

interface IExportCSVProps {
  fileName?: string;
}

const ExportIncomesCSV = ({ fileName = "incomes.csv" }: IExportCSVProps) => {
  const [isLoading, setIsLoading] = useState(false);
  // Função para exportar o array de objetos para CSV
  const handleExport = async () => {
    setIsLoading(true);
    const response: { data: IResponse<IIncome[]> } = await api.get(API.INCOMES.GET_INCOMES);
    // Cria uma planilha a partir do array de objetos
    const worksheet = XLSX.utils?.json_to_sheet(response?.data.data);

    // Converte a planilha para o formato CSV
    const csv = XLSX.utils?.sheet_to_csv(worksheet);

    // Cria um Blob do conteúdo CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Cria um link para o download do arquivo
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsLoading(false);
    toast.success("CSV exported successfully");
  };

  return (
    <Button loading={isLoading} onClick={handleExport}>
      Export to CSV
    </Button>
  );
};

export default ExportIncomesCSV;
