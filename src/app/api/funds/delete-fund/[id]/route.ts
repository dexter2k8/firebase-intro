import { AxiosError } from "axios";
import type { NextRequest } from "next/server";
// import type { IResponse } from "../types";
import { db } from "@/services/firebase";
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(req: NextRequest) {
  try {
    // const token = cookies().get("funds-explorer-token")?.value;
    // if (!token) return Response.json("Token not found", { status: 401 });

    const alias = req.nextUrl.pathname.split("/").pop() ?? "";

    const fundRef = doc(db, "funds", alias);
    await deleteDoc(fundRef);

    return Response.json("Fund deleted", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Response.json(error.response?.data.message, { status: error.response?.status });
    }
    return Response.json("Internal Server Error", { status: 500 });
  }
}
