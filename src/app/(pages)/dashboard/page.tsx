"use client";
import api from "@/services/api";
import { API } from "@/utils/paths";

export default function Dashboard() {
  const verify = async () => {
    try {
      const response = await api.get(API.AUTH.VERIFY_TOKEN);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <main>
      <h1>Dashboard</h1>
      <button onClick={verify}>Verify</button>
    </main>
  );
}
