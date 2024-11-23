import { AxiosError } from "axios";
import admin from "firebase-admin";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const token = cookies().get("funds-explorer-token")?.value;
    if (!token) return NextResponse.json({ message: "Token não fornecido." }, { status: 400 });

    const uid = req.nextUrl.pathname.split("/").pop() ?? "";

    await admin.auth().deleteUser(uid);

    return NextResponse.json("Fund created successfully", { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
