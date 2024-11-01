import moment from "moment";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "../get-incomes/types";

interface IIncomeMonthlySums extends IIncome {
  month_end?: string;
}

export function calculateMonthlySums(incomes: IIncome[], transactions: ITransaction[]) {
  //gera o range de datas mensais entre initDate e endDate
  const initDate = moment(incomes[incomes.length - 1].updated_at);
  const endDate = moment(incomes[0].updated_at);

  const dateRange = [];

  while (initDate.isSameOrBefore(endDate, "month")) {
    dateRange.push(initDate.format("YYYY-MM-DD"));
    initDate.add(1, "month");
  }

  // Etapa 1: LatestIncomesPerMonth - Seleciona a última data de atualização para cada fundo e mês
  const latestIncomesPerMonth = dateRange.flatMap((monthStart) => {
    const monthEnd = moment(monthStart).endOf("month").format("YYYY-MM-DD");

    const monthIncomes = incomes.filter((income) => income.updated_at <= monthEnd);

    const maxUpdatedIncomes = monthIncomes.reduce(
      (acc: { [alias: string]: IIncomeMonthlySums }, curr) => {
        if (!acc[curr.fund_alias] || acc[curr.fund_alias].updated_at < curr.updated_at) {
          acc[curr.fund_alias] = { ...curr, month_end: monthEnd };
        }
        return acc;
      },
      {}
    );

    return Object.values(maxUpdatedIncomes);
  });

  // Etapa 2: MonthlySums - Calcular total_patrimony e total_income para cada mês e fundo
  const monthlySums = dateRange.map((monthStart) => {
    const yearMonth = moment(monthStart).format("YYYY-MM");
    const monthEnd = moment(monthStart).endOf("month").format("YYYY-MM-DD");

    // Calcula o total_patrimony e total_income para cada fundo no mês atual
    let total_patrimony = 0;
    let total_income = 0;

    latestIncomesPerMonth.forEach((income) => {
      if (income.month_end === monthEnd) {
        // Filtra transactions até o fim do mês para obter a quantidade total
        const quantity = transactions
          .filter((trans) => trans.fund_alias === income.fund_alias)
          .reduce((sum, trans) => sum + (trans.quantity || 0), 0);

        // Adiciona ao total_patrimony
        total_patrimony += income.price * quantity;

        // Adiciona ao total_income apenas se o updated_at do income estiver no mês atual
        const incomeYearMonth = moment(income.updated_at).format("YYYY-MM");

        if (incomeYearMonth === yearMonth) {
          total_income += income.income;
        }
      }
    });

    return { year_month: yearMonth, total_patrimony, total_income };
  });

  return monthlySums.filter((monthly) => monthly.total_patrimony > 0 || monthly.total_income > 0);
}

export function getGain(final: number, initial: number) {
  if (!initial || !final) return 0;
  return Number((((final - initial) / initial) * 100).toFixed(1));
}
