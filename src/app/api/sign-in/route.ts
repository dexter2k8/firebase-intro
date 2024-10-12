import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/services/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    await signInWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      cookies().set({
        name: "funds-explorer-token",
        value: token,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      return NextResponse.json(auth.currentUser, { status: 200 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) return NextResponse.json({ message: error?.code as string }, { status: 401 });
  }
}
