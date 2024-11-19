import { AxiosError } from "axios";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import admin from "firebase-admin";
// import admin from "firebase-admin";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import type { NextRequest } from "next/server";

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
    const uid = user.uid;
    await admin.auth().setCustomUserClaims(uid, { role: "user" });

    return NextResponse.json(auth.currentUser, { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof AxiosError) {
      return Response.json(error.response?.data.message, { status: error.response?.status });
    }
    if (error) return NextResponse.json({ message: error?.code as string }, { status: 401 });
    return Response.json("Internal Server Error", { status: 500 });
  }
}
