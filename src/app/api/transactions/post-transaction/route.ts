import { AxiosError } from "axios";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IPostTransaction } from "./types";

export async function POST(req: NextRequest) {
  const body: IPostTransaction = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const transactionsRef = collection(db, "transactions");
    const { bought_at, ...rest } = body;
    const boughtAtDate = new Date(bought_at);
    const date = Timestamp.fromDate(boughtAtDate);
    await addDoc(transactionsRef, { ...rest, bought_at: date, user_id: uid });

    return NextResponse.json("Transaction created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
