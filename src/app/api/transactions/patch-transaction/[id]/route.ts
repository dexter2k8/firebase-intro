import { AxiosError } from "axios";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { TPatchTransaction } from "./types";

export async function PATCH(req: NextRequest) {
  const body: TPatchTransaction = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const id = req.nextUrl.pathname.split("/").pop() ?? "";

    const transactionsRef = doc(db, "transactions", id);
    const { bought_at, ...rest } = body;
    const boughtAtDate = new Date(bought_at);
    const date = Timestamp.fromDate(boughtAtDate);
    await updateDoc(transactionsRef, { ...rest, bought_at: date });

    return NextResponse.json("Transaction created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
