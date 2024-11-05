import { AxiosError } from "axios";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IPostIncome } from "./types";

export async function POST(req: NextRequest) {
  const body: IPostIncome = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const incomesRef = collection(db, "incomes");
    const { updated_at, ...rest } = body;
    const updatedAtDate = new Date(updated_at);
    const date = Timestamp.fromDate(updatedAtDate);
    await addDoc(incomesRef, { ...rest, updated_at: date, user_id: uid });

    return NextResponse.json("Income created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
