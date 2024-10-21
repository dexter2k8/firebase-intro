import { AxiosError } from "axios";
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import type { NextRequest } from "next/server";

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
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(error.response?.data.message, { status: error.response?.status });
    }
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
