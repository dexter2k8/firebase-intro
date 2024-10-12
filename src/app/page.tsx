"use client";
import styles from "./page.module.scss";
import Logo from "../../public/assets/logo";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import schema from "@/schemas/validateLogin";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import api from "@/services/api";

interface ISignInProps {
  email: string;
  password: string;
}

export default function SignIn() {
  const { main, container, head, item } = styles;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { control, handleSubmit } = useForm<ISignInProps>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<ISignInProps> = async ({ email, password }) => {
    try {
      setLoading(true);
      const response = await api.post("/api/sign-in", { email, password });
      if (!!response?.data) router.replace("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.message);
    }
    setLoading(false);
  };

  return (
    <main className={main}>
      <form className={container} onSubmit={handleSubmit(onSubmit)}>
        <div className={head}>
          <Logo />
          <span>Funds Explorer</span>
        </div>
        <div className={item}>
          <label htmlFor="password">Password</label>
          <Input.Controlled control={control} name="email" id="email" />
        </div>
        <div className={item}>
          <label htmlFor="password">Password</label>
          <Input.Controlled control={control} name="password" id="password" type="password" />
        </div>
        <Button loading={loading} size="large" variant="primary">
          Sign In
        </Button>
        <Link href="/sign-up">Create an account</Link>
      </form>
    </main>
  );
}
