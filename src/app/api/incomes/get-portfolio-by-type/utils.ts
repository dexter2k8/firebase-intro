import moment from "moment";
import type { IFund } from "../../funds/get-funds/types";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { TFundType } from "../../types";
import type { IIncome } from "../get-incomes/types";

interface IIncomeByType {
  type: string;
  total_patrimony: number;
  total_income: number;
}

export function calculatePatrimonyAndIncome(
  incomes: IIncome[],
  transactions: ITransaction[],
  funds: IFund[]
) {
  // Etapa 1: Obter o mês mais recente em incomes
  const mostRecentIncome = incomes.reduce((max, current) => {
    const currentDate = moment(current.updated_at);
    if (currentDate.isAfter(max)) return currentDate;

    return max;
  }, moment("1970-01-01")); // inicializar com uma data antiga

  const transactionsUpToDate = transactions.filter((t) =>
    moment(t.bought_at).isSameOrBefore(mostRecentIncome, "month")
  );

  const fundData: {
    [key: string]: { quantity: number; price: number; income: number; type: TFundType };
  } = {};

  transactions.sort((a, b) => moment(a.bought_at).diff(moment(b.bought_at)));

  transactionsUpToDate.forEach((transaction) => {
    const { fund_alias, quantity, price, bought_at } = transaction;

    // Localiza o income mais próximo
    const nearestIncome = incomes
      .filter(
        (i) =>
          i.fund_alias === fund_alias &&
          moment(i.updated_at).isSameOrBefore(mostRecentIncome, "month")
      )
      .sort((a, b) => moment(b.updated_at).diff(moment(a.updated_at)))[0]; // Income mais recente até o mês atual

    // Filtra os incomes do mês para cada fundo
    const monthlyIncomes = incomes.filter(
      (i) => i.fund_alias === fund_alias && moment(i.updated_at).isSame(mostRecentIncome, "month")
    );

    if (!fundData[fund_alias]) {
      fundData[fund_alias] = {
        quantity: 0,
        price,
        income: 0,
        type: funds.find((f) => f.alias === fund_alias)?.type as TFundType,
      }; // Primeiro registro
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

  const resultByType = Object.values(fundData).reduce(
    (acc: IIncomeByType[], curr) => {
      const patrimonyValue = curr.quantity * curr.price;
      const incomeValue = curr.income;

      // Find or create the entry for the current type
      let item = acc.find((entry) => entry.type === curr.type);
      if (!item) {
        item = { type: curr.type, total_patrimony: 0, total_income: 0 };
        acc.push(item);
      }

      // Update patrimony and income
      item.total_patrimony += patrimonyValue;
      item.total_income += incomeValue;

      return acc;
    },
    [] // Initial accumulator as an empty array
  );

  return resultByType;
}
