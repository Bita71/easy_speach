import { Events, State } from "@/store";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useStoreon } from "storeon/react";

export const useCheckAuth = () => {
  const { push } = useRouter();
  const { user } = useStoreon<State, Events>("user")

  useEffect(() => {
    if (!user) {
      // push('/')
    } 
  }, [push, user]);

  return Boolean(user);
}