import moment from "moment";
import type { ITransaction } from "../../transactions/get-transactions/types";
import type { IIncome } from "../get-incomes/types";
import type { IGetIncomeByFund } from "./[alias]/types";

export function calculateIncomeDetails(incomes: IIncome[], transactions: ITransaction[]) {
  // Calcular `quantity`, `patrimony` e `variation` para cada `income`
  const detailedIncomes = incomes.map((income, index, array) => {
    // Calcular `quantity` de transactions até `updated_at`
    const quantity = transactions
      .filter(
        (trans) =>
          trans.fund_alias === income.fund_alias &&
          moment(trans.bought_at).isSameOrBefore(income.updated_at)
      )
      .reduce((sum, trans) => sum + (trans.quantity || 0), 0);

    // Calcular `patrimony`
    const patrimony = income.price * quantity;

    // Calcular `variation` como a diferença entre o `price` atual e o `price` anterior
    const previousIncome = array[index + 1]; // Próximo no array é o anterior na ordem decrescente
    const variation = previousIncome ? income.price - previousIncome.price : null;

    // Calcula o provento em relação ao valor patrimonial
    const pvp = (income.income / patrimony) * 100;

    return {
      ...income,
      quantity,
      patrimony,
      variation,
      pvp,
    };
  }) satisfies IGetIncomeByFund[];

  return detailedIncomes;
}
