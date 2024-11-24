"use client";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import schema from "@/schemas/validateLogin";
import { useAuth } from "@/store/useAuth";
import styles from "./page.module.scss";
import Logo from "../../public/assets/logo";
import type { SubmitHandler } from "react-hook-form";

export interface ISignInProps {
  email: string;
  password: string;
}

export default function SignIn() {
  const { main, container, head, item } = styles;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();
  const { control, handleSubmit } = useForm<ISignInProps>({ resolver: yupResolver(schema) });

  const onSubmit: SubmitHandler<ISignInProps> = async (data) => {
    setLoading(true);
    const result = await signIn(data);
    if (result) router.replace("/dashboard");
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
          <label htmlFor="password">Email</label>
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
