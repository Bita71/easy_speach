import { FC } from "react";
import { Button, Col, Dropdown, MenuProps, Row, Space, Typography } from "antd";
import styles from "./styles.module.css";
import {
  DingtalkOutlined,
  DownOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { useCheckAuth } from "@/hooks";
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";
import Link from "next/link";

const { Title } = Typography;

const items: MenuProps["items"] = [
  {
    key: "1",
    label: <Link href="/hystory">История фраз</Link>,
  },
  {
    key: "2",
    label: <Link href="/exit">Выход</Link>,
    danger: true,
  },
];

export const Header: FC = () => {
  const { user } = useStoreon<State, Events>("user");
  const isAuth = useCheckAuth();
  return (
    <Row
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        padding: "1em",
        boxShadow: "1px 20px 38px -5px rgba(34, 60, 80, 0.2)",
      }}
    >
      <Col span={8} />
      <Col style={{ textAlign: "center" }} span={8}>
        <Link href={isAuth ? "/training" : "/"}>
          <Title
            style={{ margin: 0 }}
            type="secondary"
            className={styles.title}
          >
            <DingtalkOutlined style={{ marginRight: ".25em" }} />
            Easy Speech
          </Title>
        </Link>
      </Col>
      <Col
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
        span={8}
      >
        {isAuth && (
          <Dropdown menu={{ items }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                {user?.name}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        )}
      </Col>
    </Row>
  );
};
