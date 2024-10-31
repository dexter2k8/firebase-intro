import { AxiosError } from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IPatchTransaction } from "./types";

export async function PATCH(req: NextRequest) {
  const body: IPatchTransaction = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    const uid = await validateUser(token);
    if (!uid) return NextResponse.json("Invalid token", { status: 401 });

    const id = req.nextUrl.pathname.split("/").pop() ?? "";

    const transactionsRef = doc(db, "transactions", id);
    await updateDoc(transactionsRef, { ...body });

    return NextResponse.json("Transaction created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
