import { auth } from "@/services/firebase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await auth.signOut();
    return NextResponse.json({ message: "Sign out successfully" }, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) return NextResponse.json({ message: error?.code as string }, { status: 401 });
  }
}
