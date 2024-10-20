"use client";
import { useSWR } from "@/hook/useSWR";
import { API } from "@/utils/paths";
// import { db } from "@/services/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useEffect } from "react";

export default function Dashboard() {
  const { response } = useSWR(API.FUNDS.GET_FUNDS);

  // useEffect(() => {
  //   const fundsRef = collection(db, "funds");
  //   const response = async () => {
  //     const fundsData = await getDocs(fundsRef);
  //     const response = fundsData.docs.map((doc) => ({ ...doc.data(), alias: doc.id }));
  console.log(response);
  //   };

  //   response();
  // }, []);

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}
