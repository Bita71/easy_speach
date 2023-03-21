import Head from "next/head";
import "babel-polyfill";
import styles from "@/styles/common.module.css";
import { Header, Spinner } from "@/components";
import { Button, Checkbox, Select, Table, Tag, Typography } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useQuery } from "@tanstack/react-query";
import { getHystoriesByUser } from "@/helpers/hystory";
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";
import { useMemo } from "react";
import { ComplexityType, Phrase } from "@prisma/client";
import Link from "next/link";
import dayjs from "dayjs";

interface DataType {
  key: string;
  phrase: Phrase;
  complexity: ComplexityType;
  lastAttempt: string;
  attemptsCount: number;
  result: number;
  skipped: boolean;
}
const complexityColor = {
  [ComplexityType.EASY]: "green",
  [ComplexityType.MEDIUM]: "orange",
  [ComplexityType.HARD]: "red",
};

const getRatingColor = (value: number) => {
  let ratingColor = "red";
  if (value >= 70) {
    ratingColor = "green";
  } else if (value >= 40) {
    ratingColor = "orange";
  }

  return ratingColor;
};
const columns: ColumnsType<DataType> = [
  {
    title: "Фраза",
    dataIndex: "phrase",
    render({ text }: Phrase, record) {
      return <Link href={`/phrase/${record.key}`}>{text}</Link>;
    },
  },
  {
    title: "Сложность",
    dataIndex: "complexity",
    render: (value: ComplexityType) => (
      <Tag color={complexityColor[value]}>
        {ComplexityType[value].toUpperCase()}
      </Tag>
    ),
    filters: [
      {
        text: ComplexityType.EASY,
        value: "EASY",
      },
      {
        text: ComplexityType.MEDIUM,
        value: "MEDIUM",
      },
      {
        text: ComplexityType.HARD,
        value: "HARD",
      },
    ],
    onFilter: (value, record) => record.complexity === value,
  },
  {
    title: "Результат",
    dataIndex: "result",
    render: (value: number) => (
      <span style={{ color: getRatingColor(value) }}>{value.toFixed(2)}%</span>
    ),
    sorter: (a, b) => a.result - b.result,
  },
  {
    title: "Пропущено",
    dataIndex: "skipped",
    render: (value: boolean) => <Checkbox checked={value} />,
    filters: [
      {
        text: "Пропущено",
        value: true,
      },
      {
        text: "Не пропущено",
        value: false,
      },
    ],
    onFilter: (value, record) => record.skipped === value,
  },
  {
    title: "Количество попыток",
    dataIndex: "attemptsCount",
    sorter: (a, b) => a.attemptsCount - b.attemptsCount,
  },
  {
    title: "Последняя активность",
    dataIndex: "lastAttempt",
    render: (value: number) => (
      <>{dayjs(value).format('HH:mm:ss DD.MM.YYYY')}</>
    ),
    sorter: (a, b) => dayjs(a.attemptsCount).valueOf() - dayjs(b.attemptsCount).valueOf(),
  },
];

function Hystory() {
  const { user } = useStoreon<State, Events>("user");
  const userId = user?.id || "";

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ["hystoryAll"],
    queryFn: () => getHystoriesByUser(userId),
    enabled: Boolean(userId),
  });

  const tableData = useMemo(() => {
    return (
      data?.map(
        ({ id, attemptsCount, phrase, result, skipped, updatedAt }) => ({
          key: id,
          phrase: phrase,
          complexity: phrase.complexity,
          lastAttempt: updatedAt,
          attemptsCount,
          result,
          skipped,
        })
      ) || []
    );
  }, [data]);
  return (
    <>
      <Head>
        <title>История фраз</title>
      </Head>
      <Header />
      <main style={{ flexDirection: "column" }} className={styles.content}>
        <div
          style={{
            maxHeight: "75%",
            overflow: "auto",
            boxShadow: "0px 0px 38px 5px rgba(34, 60, 80, 0.2)",
            backgroundColor: "white",
            borderRadius: "1em",
            padding: "1em",
            width: 1000,
          }}
        >
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            sticky
            loading={isLoading}
          />
        </div>
      </main>
    </>
  );
}

export default Hystory;
