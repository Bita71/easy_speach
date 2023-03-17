import Head from "next/head";
import { Cleaner, DeviceList, Lamp } from "@/components";
import { Button, Empty, Spin, Typography } from "antd";
import styles from "@/styles/Home.module.css";
import { useQuery } from "@tanstack/react-query";
import { getAllLamps } from "@/helpers/lamp";
import { PlusCircleOutlined } from "@ant-design/icons";
import { CreateModal } from "@/components/CreateModal";
import { useState } from "react";
import { getAllCleaners } from "@/helpers/cleaner";
import { Socket } from "@/components/Socket";
import { getAllSockets } from "@/helpers/socket";
import dynamic from 'next/dynamic'

const HeaderWithNoSSR = dynamic(() => import('../components/Header'), {
  ssr: false
})

const { Title } = Typography;

export default function Home() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: lamps, isLoading: isLoadingLamps } = useQuery({
    queryKey: ["lamps"],
    queryFn: () => getAllLamps(),
  });

  const { data: cleaners, isLoading: isLoadingCleaners } = useQuery({
    queryKey: ["cleaners"],
    queryFn: () => getAllCleaners(),
  });

  const { data: sockets, isLoading: isLoadingSockets } = useQuery({
    queryKey: ["sockets"],
    queryFn: () => getAllSockets(),
  });
  const handleCreateClick = () => setIsCreateOpen(true);
  const handleCreateClose = () => setIsCreateOpen(false);

  const isLoading = isLoadingLamps || isLoadingCleaners || isLoadingSockets;

  const isEmpty = !isLoading && !lamps?.length && !cleaners?.length && !sockets?.length;

  return (
    <>
      <Head>
        <title>Smarthouse</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HeaderWithNoSSR />
      <main className={styles.main}>
        <div className={styles.title}>
          <CreateModal open={isCreateOpen} onClose={handleCreateClose} />
          <Title style={{ margin: 0 }} level={2}>
            Устройства
          </Title>
          <Button
            type="text"
            className={styles.titleButton}
            onClick={handleCreateClick}
          >
            <PlusCircleOutlined />
          </Button>
        </div>
        {isLoading && (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        )}
        {isEmpty && (
          <Empty
            description="Устройства отсутствуют"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
        {!isLoading && <DeviceList>
          {lamps?.map((lamp) => (
            <Lamp key={lamp.id} {...lamp} />
          ))}
          {cleaners?.map((cleaner) => (
            <Cleaner key={cleaner.id} {...cleaner} />
          ))}
          {sockets?.map((socket) => (
            <Socket key={socket.id} {...socket} />
          ))}
        </DeviceList>}
      </main>
    </>
  );
}
