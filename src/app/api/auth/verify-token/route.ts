import { signInWithCustomToken } from "firebase/auth";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { auth } from "@/services/firebase";
import type { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;
  if (!token) return NextResponse.json(undefined, { status: 200 });

  try {
    const verifiedToken: string | undefined = await admin
      .auth()
      .verifyIdToken(token)
      .then(() => token)
      .catch(async (err) => {
        if (err.code === "auth/id-token-expired") {
          const decoded = jwt.decode(token, { complete: true }) as JwtPayload;
          const uid = decoded?.payload.user_id;
          if (!uid) return undefined;

          const newToken = await admin.auth().createCustomToken(uid);

          const idToken = await signInWithCustomToken(auth, newToken)
            .then((userCredential) => userCredential.user.getIdToken())
            .catch((error) => {
              console.error("Authentication failed:", error);
              return undefined;
            });

          return idToken;
        } else {
          console.error(err);
          return undefined;
        }
      });

    return NextResponse.json(verifiedToken, { status: 200 });
  } catch (error) {
    console.error("Erro ao verificar token de App Check:", error);
    return NextResponse.json({ message: "Falha ao verificar o token." }, { status: 500 });
  }
}
