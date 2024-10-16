import { create, StoreApi, UseBoundStore } from "zustand";
import { TActions, TState } from "./types";
import { GetUser, SignIn, SignOut, SignUp } from "./fetchers";

export const useAuth: UseBoundStore<StoreApi<TState & TActions>> = create<TState & TActions>(
  (set) => ({
    user: undefined,
    setValue<T extends keyof TState>(state: T, value: TState[T]): void {
      set({ [state]: value });
    },

    signIn: async (props) => await SignIn(props),
    signUp: async (props) => await SignUp(props),
    signOut: async () => await SignOut(),
    getUser: async () => await GetUser(),
  })
);
