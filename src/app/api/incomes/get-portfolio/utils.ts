import moment from "moment";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "./types";

interface IIncomeMonthlySums extends IIncome {
  month_end?: string;
}

export function calculateMonthlySums(
  incomes: IIncome[],
  transactions: ITransaction[],
  initDate: string,
  endDate: string
) {
  // Helper para gerar o range de datas mensais entre initDate e endDate
  function generateDateRange(initDate: string, endDate: string) {
    console.log(incomes?.[0].updated_at, incomes?.[incomes?.length - 1].updated_at);

    const dateRange = [];
    const currentDate = moment(initDate);

    while (currentDate.isSameOrBefore(endDate, "month")) {
      dateRange.push(currentDate.format("YYYY-MM-DD"));
      currentDate.add(1, "month");
    }

    return dateRange;
  }

  const dateRange = generateDateRange(initDate, endDate);

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
        const fundAlias = income.fund_alias;

        // Filtra transactions até o fim do mês para obter a quantidade total
        const quantity = transactions
          .filter((trans) => trans.fund_alias === fundAlias && trans.bought_at <= monthEnd)
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
