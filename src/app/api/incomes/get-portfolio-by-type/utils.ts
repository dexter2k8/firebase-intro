import moment from "moment";
import type { IFund } from "../../funds/get-funds/types";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "../get-incomes/types";

interface IIncomeByType {
  total_patrimony: number;
  total_income: number;
}

export function calculatePatrimonyAndIncome(
  incomes: IIncome[],
  transactions: ITransaction[],
  funds: IFund[]
) {
  // Etapa 1: Obter o registro mais recente de cada fund_alias em incomes
  const latestIncomes = incomes.reduce((acc: { [alias: string]: IIncome }, curr) => {
    if (
      !acc[curr.fund_alias] ||
      moment(acc[curr.fund_alias].updated_at).isBefore(curr.updated_at)
    ) {
      acc[curr.fund_alias] = curr;
    }
    return acc;
  }, {});

  console.log(latestIncomes);

  // Transformar latestIncomes em um array e adicionar quantidade e monthly_income
  const latestIncomesWithDetails = Object.values(latestIncomes).map((income) => {
    // Calcular a quantidade total de transações até a data `updated_at` de income
    const quantity = transactions
      .filter(
        (trans) =>
          trans.fund_alias === income.fund_alias &&
          moment(trans.bought_at).isSameOrBefore(income.updated_at)
      )
      .reduce((sum, trans) => sum + (trans.quantity || 0), 0);

    // Calcular monthly_income do último mês
    const lastMonth = moment().subtract(1, "month").format("YYYY-MM");
    const monthlyIncome = incomes
      .filter(
        (i2) =>
          i2.fund_alias === income.fund_alias &&
          moment(i2.updated_at).format("YYYY-MM") === lastMonth
      )
      .reduce((sum, i2) => sum + (i2.income || 0), 0);

    return {
      ...income,
      quantity,
      monthly_income: monthlyIncome,
    };
  });

  console.log(latestIncomesWithDetails);

  // Etapa 2: Agrupar por tipo de fundo e calcular total_patrimony e total_income
  const result = latestIncomesWithDetails.reduce(
    (acc: { [alias: string]: IIncomeByType }, income) => {
      const fund = funds.find((f) => f.alias === income.fund_alias);

      if (fund) {
        const fundType = fund.type;
        if (!acc[fundType]) {
          acc[fundType] = { total_patrimony: 0, total_income: 0 };
        }

        acc[fundType].total_patrimony += income.price * income.quantity;
        acc[fundType].total_income += income.monthly_income;
      }

      return acc;
    },
    {}
  );

  // Formatar resultado em um array
  return Object.keys(result).map((type) => ({
    type,
    total_patrimony: result[type].total_patrimony,
    total_income: result[type].total_income,
  }));
}
