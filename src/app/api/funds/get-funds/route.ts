import { AxiosError } from "axios";
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { IFunds } from "./types";

export async function GET() {
  try {
    const fundsRef = collection(db, "funds");
    const response = await getDocs(fundsRef);

    const data = response.docs.map((doc) => ({ ...doc.data(), alias: doc.id })) as IFunds[];
    const count = data.length;

    return Response.json({ data, count }, { status: 200 });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Response.json(error.response?.data.message, { status: error.response?.status });
    }
    return Response.json("Internal Server Error", { status: 500 });
  }
}
