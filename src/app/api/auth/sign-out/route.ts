import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";

export async function GET() {
  try {
    await auth.signOut();
    return NextResponse.json({ message: "Sign out successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
