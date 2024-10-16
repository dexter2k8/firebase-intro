"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import schema from "@/schemas/validateSignUp";
import { useAuth } from "@/store/useAuth";
import Logo from "../../../public/assets/logo";
import styles from "../page.module.scss";
import type { SubmitHandler } from "react-hook-form";
import type { ISignUpProps } from "@/store/useAuth/types";

export default function SignUp() {
  const { main, container, head, item } = styles;
  const { signUp } = useAuth();
  const router = useRouter();
  const { control, handleSubmit } = useForm<ISignUpProps>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ISignUpProps> = async (data) => {
    if (await signUp(data)) router.push("/");
  };

  return (
    <main className={main}>
      <form className={container} onSubmit={handleSubmit(onSubmit)}>
        <div className={head}>
          <Logo />
          <span>Funds Explorer</span>
        </div>
        <div className={item}>
          <label htmlFor="name">Name</label>
          <Input.Controlled control={control} name="name" id="name" />
        </div>
        <div className={item}>
          <label htmlFor="email">Email</label>
          <Input.Controlled control={control} name="email" id="email" />
        </div>
        <div className={item}>
          <label htmlFor="password">Password</label>
          <Input.Controlled
            control={control}
            name="password"
            id="password"
            type="password"
            autoComplete="new-password"
          />
        </div>
        <div className={item}>
          <label htmlFor="confirmPassword"> Confirm password</label>
          <Input.Controlled
            control={control}
            name="confirmPassword"
            id="confirmPassword"
            type="password"
          />
        </div>
        <div className={item}>
          <label htmlFor="avatar">Avatar URL (optional)</label>
          <Input.Controlled control={control} name="avatar" id="avatar" />
        </div>
        <Button size="large" variant="primary">
          Create account
        </Button>
        <Link href="/">Return to Sign In</Link>
      </form>
    </main>
  );
}
