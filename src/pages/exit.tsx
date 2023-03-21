import Head from "next/head";
import styles from "@/styles/common.module.css";
import { Header } from "@/components";
import { useRouter } from "next/router";
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";
import { useEffect } from "react";

export default function Exit() {
  const { push } = useRouter();
  const { dispatch } = useStoreon<State, Events>("user");

  useEffect(() => {
    localStorage.removeItem("user");
    dispatch("delete");
    push("/");
  }, [dispatch, push]);
  return (
    <>
      <Head>
        <title>Тренирвока</title>
      </Head>
      <Header />
      <main style={{ flexDirection: "column" }} className={styles.content}>
        Выход...
      </main>
    </>
  );
}
