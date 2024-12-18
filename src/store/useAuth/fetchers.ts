import { toast } from "react-toastify";
import api from "@/services/api";
import { API } from "@/utils/paths";
import type { ISignInProps, ISignUpProps } from "./types";

async function SignIn({ email, password, name, avatar }: ISignInProps) {
  try {
    await api.post(API.AUTH.SIGN_IN, { email, password, name, avatar });

    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.message);
  }
  return false;
}

async function SignUp({ email, password, name, avatar }: ISignUpProps) {
  try {
    await api.post(API.AUTH.SIGN_UP, { email, password, name, avatar });

    toast.success("Sign up successfully");
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.message);
  }
  return false;
}

async function SignOut() {
  try {
    const response = await api.get(API.AUTH.SIGN_OUT);
    if (response.status === 200) return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.message);
  }
  return false;
}

async function GetUser() {
  try {
    const response = await api.get(API.AUTH.GET_USER);
    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    toast.error(error?.message);
  }
  return undefined;
}

export { SignIn, SignOut, SignUp, GetUser };
