import moment from "moment";
import type { IIncome } from "./types";

interface IIncomeByMonth {
  [key: string]: { total_income: number; total_patrimony: number; aliases: Set<string> };
}

export function sumByMonth(incomes: IIncome[]) {
  const incomesByMonth = incomes.reduce((acc: IIncomeByMonth, income: IIncome) => {
    const monthYear = moment(income.updated_at).format("YYYY-MM");

    // Cria o mês se não existir
    if (!acc[monthYear]) {
      acc[monthYear] = { total_income: 0, total_patrimony: 0, aliases: new Set() };
    }
    // Verifica se o alias ja foi somado no mes. Caso não, acumula o valor no mês correspondente
    if (!acc[monthYear].aliases.has(income.fund_alias)) {
      acc[monthYear].total_income += income.income;
      acc[monthYear].total_patrimony += income.price; // substituir income.price por income.price * income.quantity
      acc[monthYear].aliases.add(income.fund_alias);
    }
    return acc;
  }, {});
  return Object.entries(incomesByMonth).map(([YearMonth, { total_income, total_patrimony }]) => ({
    YearMonth,
    total_income,
    total_patrimony,
  }));
}
