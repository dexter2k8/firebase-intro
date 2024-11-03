import { AxiosError } from "axios";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IFund } from "../../funds/get-funds/types";

export async function GET() {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const fundsRef = collection(db, "funds");
    const transactionsRef = collection(db, "transactions");

    const qFunds = query(fundsRef);

    const qTransactions = query(
      transactionsRef,
      where("user_id", "==", uid),
      orderBy("bought_at", "desc")
    );

    const transactionsDoc = await getDocs(qTransactions);
    const fundsDoc = await getDocs(qFunds);
    const funds = fundsDoc?.docs.map((doc) => ({ ...doc.data(), alias: doc.id })) as IFund[];

    const transactions = transactionsDoc?.docs.map((doc) => doc.data());

    // Agrupa as transações por fundo
    const transactionsFund = transactions.reduce((acc, curr) => {
      if (!acc[curr.fund_alias]) {
        acc[curr.fund_alias] = { ...curr, qtd: curr.quantity };
      } else {
        acc[curr.fund_alias].qtd += curr.quantity;
      }
      return acc;
    }, {});

    // Filtra os fundos que possuem quantidade
    const selfFunds = Object.values(transactionsFund).filter((transaction) => transaction.qtd > 0);

    // Retorna os fundos do usuário, retornando uma lista de fundos
    const data = selfFunds.map((transaction) => {
      const fund = funds.find((fund) => fund.alias === transaction.fund_alias);
      return { ...fund };
    }) as IFund[];

    const count = data?.length;

    return Response.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
