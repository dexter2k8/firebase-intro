import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/services/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, avatar = "" } = body;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (user && name) {
      updateProfile(user, {
        displayName: name,
        photoURL: avatar,
      });
    }
    return NextResponse.json(auth.currentUser, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) return NextResponse.json({ message: error?.code as string }, { status: 401 });
  }
}
