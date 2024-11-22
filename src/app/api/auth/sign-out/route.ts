import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";

export async function GET() {
  try {
    await auth.signOut();
    cookies().delete("funds-explorer-token");
    return NextResponse.json({ message: "Sign out successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
