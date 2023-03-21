import Head from "next/head";
import styles from "@/styles/common.module.css";
import { Header } from "@/components";
import { Button, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/helpers/user";
import { authUser } from "@/helpers/auth";
import { ErrorMessages, ResError } from "@/types";
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";
import { User } from "@prisma/client";
import { useRouter } from "next/router";

const { Title, Text } = Typography;

interface LoginValues {
  login: string;
  password: string;
}

interface RegValues extends LoginValues {
  name: string;
}

export default function Home() {
  const { dispatch, user } = useStoreon<State, Events>("user");
  const { push } = useRouter();
  const [isEnter, setIsEnter] = useState(true);
  const [isLoginError, setIsLoginError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [isRegError, setIsRegError] = useState(false);

  useEffect(() => {
    if (user) {
      push("/training");
    }
  }, [dispatch, push, user]);

  const { mutate: auth, isLoading: isAuthing } = useMutation({
    mutationFn: authUser,
    onError: (error: ResError) => {
      switch (error.response?.data.message) {
        case ErrorMessages.userNotExists:
          setIsLoginError(true);
          break;
        case ErrorMessages.badPassword:
          setIsPasswordError(true);
          break;
        default:
          break;
      }
    },
    onSuccess: (data: User) => {
      dispatch("set", data);
      localStorage.setItem("user", JSON.stringify(data));
    },
  });

  const { mutate: create, isLoading: isCreating } = useMutation({
    mutationFn: createUser,
    onError: (error: ResError) => {
      if (error.response?.data.message === ErrorMessages.userExists) {
        setIsRegError(true);
      }
    },
    onSuccess: (data: User) => {
      dispatch("set", data);
      localStorage.setItem("user", JSON.stringify(data));
    },
  });

  const handleLogin = (values: LoginValues) => {
    setIsLoginError(false);
    setIsPasswordError(false);
    const { login, password } = values;
    const formatedLogin = login.trim();
    const formatedPassword = password.trim();
    if (!formatedLogin || !formatedPassword) {
      return;
    }
    auth({
      login: formatedLogin,
      password: formatedPassword,
    });
  };

  const handleReg = (values: RegValues) => {
    setIsRegError(false);
    const { login, password, name } = values;
    const formatedName = name.trim();
    const formatedLogin = login.trim();
    const formatedPassword = password.trim();
    if (!formatedName || !formatedLogin || !formatedPassword) {
      return;
    }
    create({
      login: formatedLogin,
      name: formatedName,
      password: formatedPassword,
    });
  };

  const handleChangeType = () => {
    setIsEnter((state) => !state);
  };
  return (
    <>
      <Head>
        <title>Easy Speach</title>
      </Head>
      <Header />
      <main style={{ flexDirection: "column" }} className={styles.content}>
        <Title
          type="secondary"
          style={{ textAlign: "center", marginBottom: "1.5em" }}
          level={3}
        >
          {isEnter ? "Войдите" : "Зарегистрируйтесь"}, чтобы тренировать
          произношение
        </Title>
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{
            maxWidth: 400,
            width: "100%",
            boxShadow: "0px 0px 38px 5px rgba(34, 60, 80, 0.2)",
            padding: "1em",
            borderRadius: "1em",
          }}
          initialValues={{ remember: true }}
          onFinish={isEnter ? handleLogin : handleReg}
        >
          {!isEnter && (
            <Form.Item
              label="Имя"
              name="name"
              rules={[{ required: true, message: "Имя обязателено" }]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Логин обязателен" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Пароль обязателен" }]}
          >
            <Input.Password />
          </Form.Item>
          {isEnter && isLoginError && (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Text type="danger">
                Пользователя с таким логином не существует
              </Text>
            </Form.Item>
          )}
          {isEnter && isPasswordError && (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Text type="danger">Неверный пароль</Text>
            </Form.Item>
          )}
          {!isEnter && isRegError && (
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Text type="danger">
                Пользователь с таким логином уже существует
              </Text>
            </Form.Item>
          )}
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              loading={isCreating || isAuthing}
              type="default"
              color=""
              htmlType="submit"
            >
              {isEnter ? "Войти" : "Создать аккаунт"}
            </Button>
          </Form.Item>
        </Form>
        <Button
          onClick={handleChangeType}
          type="dashed"
          style={{ marginTop: "2em" }}
        >
          {isEnter ? "Создать аккаунт" : "Войти"}
        </Button>
      </main>
    </>
  );
}
