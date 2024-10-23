import { AxiosError } from "axios";
import { collection, doc, writeBatch } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IIncome } from "../get-incomes/types";

export async function POST(req: NextRequest) {
  const body: Partial<IIncome>[] = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = validateUser(token);
    if (!uid) return NextResponse.json("Invalid data", { status: 401 });

    const batch = writeBatch(db);
    const incomesRef = collection(db, "incomes");

    body.forEach((income: Partial<IIncome>) => {
      const docRef = doc(incomesRef);
      batch.set(docRef, { ...income, user_id: uid });
    });

    await batch.commit();

    return NextResponse.json("Incomes created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
