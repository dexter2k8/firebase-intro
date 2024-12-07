import moment from "moment";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "../get-incomes/types";

export function calculateMonthlySums(
  startDate: string,
  incomes: IIncome[],
  transactions: ITransaction[]
) {
  const initDate = moment(startDate).startOf("month");
  const currentDate = moment(new Date());
  const endDate = currentDate.subtract(1, "month").endOf("month").format("YYYY-MM-DD");

  const dateRange = [];
  while (initDate.isSameOrBefore(endDate, "month")) {
    dateRange.push(initDate.format("YYYY-MM"));
    initDate.add(1, "month");
  }

  const monthlySums = dateRange.map((month) => {
    const transactionsUpToDate = transactions.filter((t) =>
      moment(t.bought_at).isSameOrBefore(month, "month")
    );

    const fundData: { [key: string]: { quantity: number; price: number; income: number } } = {};

    transactionsUpToDate.forEach((transaction) => {
      const { fund_alias, quantity, price, bought_at } = transaction;

      // Localiza o income mais próximo
      const nearestIncome = incomes
        .filter(
          (i) => i.fund_alias === fund_alias && moment(i.updated_at).isSameOrBefore(month, "month")
        )
        .sort((a, b) => moment(b.updated_at).diff(moment(a.updated_at)))[0]; // Income mais recente até o mês atual

      // Filtra os incomes do mês para cada fundo
      const monthlyIncomes = incomes.filter(
        (i) => i.fund_alias === fund_alias && moment(i.updated_at).isSame(month, "month")
      );

      if (!fundData[fund_alias]) {
        fundData[fund_alias] = { quantity: 0, price, income: 0 }; // Primeiro registro
      }

      fundData[fund_alias].quantity += quantity;
      fundData[fund_alias].income = monthlyIncomes.reduce((acc, i) => acc + i.income, 0);

      // Atualiza o preço com base na comparação das datas
      if (nearestIncome && moment(nearestIncome.updated_at).isAfter(bought_at)) {
        fundData[fund_alias].price = nearestIncome.price;
      } else {
        fundData[fund_alias].price = price;
      }
    });

    const total_patrimony = Object.values(fundData).reduce(
      (acc, { quantity, price }) => acc + quantity * price,
      0
    );

    const total_income = Object.values(fundData).reduce((acc, { income }) => acc + income, 0);

    return { year_month: month, total_patrimony, total_income };
  });

  return monthlySums;
}

export function getGain(final: number, initial: number) {
  if (!initial || !final) return 0;
  return Number((((final - initial) / initial) * 100).toFixed(1));
}
