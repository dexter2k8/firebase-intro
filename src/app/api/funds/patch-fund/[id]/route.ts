import { AxiosError } from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/services/firebase";
import { validateUser } from "@/utils/lib";
import type { IPatchFund } from "./types";

export async function PATCH(req: NextRequest) {
  const body: IPatchFund = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!validateUser(token)) return NextResponse.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const fundsRef = doc(db, "funds", alias);
    await updateDoc(fundsRef, { ...body });

    return NextResponse.json("Fund created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
