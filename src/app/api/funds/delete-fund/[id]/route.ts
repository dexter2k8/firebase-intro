import { AxiosError } from "axios";
import type { NextRequest } from "next/server";
import { db } from "@/services/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { isValidToken } from "@/utils/lib";

export async function DELETE(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!isValidToken(token)) return Response.json("Invalid token", { status: 401 });

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
