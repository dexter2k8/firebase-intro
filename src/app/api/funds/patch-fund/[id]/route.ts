import { AxiosError } from "axios";
import type { NextRequest } from "next/server";
import { db } from "@/services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { IPatchFund } from "./types";
import { cookies } from "next/headers";
import { isValidToken } from "@/utils/lib";

export async function PATCH(req: NextRequest) {
  const body: IPatchFund = await req.json();

  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!isValidToken(token)) return Response.json("Invalid token", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const fundRef = doc(db, "funds", alias);
    await updateDoc(fundRef, { ...body });

    return Response.json("Fund created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Response.json(error.response?.data.message, { status: error.response?.status });
    }
    return Response.json("Internal Server Error", { status: 500 });
  }
}
