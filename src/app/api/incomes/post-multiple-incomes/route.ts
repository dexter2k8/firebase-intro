import { AxiosError } from "axios";
import { collection, doc, writeBatch } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IIncome } from "../get-incomes/types";

const brapi_token = process.env.NEXT_PUBLIC_BRAPI_TOKEN;

export async function POST(req: NextRequest) {
  const body: Partial<IIncome>[] = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = validateUser(token);
    if (!uid) return NextResponse.json("Invalid data", { status: 401 });

    const batch = writeBatch(db);
    const incomesRef = collection(db, "incomes");

    for (const income of body) {
      const fund = income.fund_alias;
      const response = await fetch(`https://brapi.dev/api/quote/${fund}?token=${brapi_token}`).then(
        (res) => res.json()
      );
      const price = response?.results[0].regularMarketPrice ?? 0;

      const docRef = doc(incomesRef);
      batch.set(docRef, { ...income, user_id: uid, price });
    }

    await batch.commit();

    return NextResponse.json("Incomes created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
