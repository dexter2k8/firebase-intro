import { signInWithCustomToken } from "firebase/auth";
import admin from "firebase-admin";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import { decodeToken } from "@/utils/lib";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;
  if (!token) return NextResponse.json({ message: "Token not provided" }, { status: 401 });

  try {
    const verifiedToken: { message: string; status: number } = await admin
      .auth()
      .verifyIdToken(token)
      .then(() => ({ message: token, status: 200 }))
      .catch(async (err) => {
        if (err.code === "auth/id-token-expired") {
          const payload = decodeToken(token);
          const uid = payload.user_id;
          if (!uid) return { message: err.message, status: 401 };

          const newToken = await admin.auth().createCustomToken(uid);

          const idToken = await signInWithCustomToken(auth, newToken)
            .then((userCredential) => userCredential.user.getIdToken())
            .catch((error) => {
              console.error("Authentication failed:", error);
              return { message: "Authentication failed", status: 401 };
            });

          return { message: idToken, status: 200 };
        } else {
          console.error(err);
          return { message: err.message, status: 401 };
        }
      });

    return NextResponse.json({ message: verifiedToken.message }, { status: verifiedToken.status });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ message: "Falha ao verificar o token." }, { status: 500 });
  }
}

export const runtime = "nodejs";
