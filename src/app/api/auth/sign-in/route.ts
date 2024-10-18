import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/services/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, avatar } = body;

    await signInWithEmailAndPassword(auth, email, password);
    //setPersistence force browser to keep the session active when you reload page
    // you can choose between browserLocalPersistence and browserSessionPersistence
    await setPersistence(auth, browserLocalPersistence);

    if (auth.currentUser) {
      if (name) {
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL: avatar,
        });
      }

      const token = await auth.currentUser.getIdToken();
      cookies().set({
        name: "funds-explorer-token",
        value: token,
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      });
    }
    return NextResponse.json(auth.currentUser, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) return NextResponse.json({ message: error?.code as string }, { status: 401 });
  }
}
