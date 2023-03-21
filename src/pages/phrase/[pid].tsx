import Head from "next/head";
import "babel-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styles from "@/styles/common.module.css";
import { Header, Spinner } from "@/components";
import { Button, Select, Tag, Typography } from "antd";
import { ComplexityType, Phrase } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPhrasesForUser } from "@/helpers/training";
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";
import { AudioOutlined, RightOutlined } from "@ant-design/icons";
import { getHystoryById, updatePhrace } from "@/helpers/hystory";
import { getPhraseById } from "@/helpers/phrase";
import { useRouter } from "next/router";
import Link from "next/link";

const getRatingColor = (value: number) => {
  let ratingColor = "red";
  if (value >= 70) {
    ratingColor = "green";
  } else if (value >= 40) {
    ratingColor = "orange";
  }

  return ratingColor;
};

const complexityColor = {
  [ComplexityType.EASY]: "green",
  [ComplexityType.MEDIUM]: "orange",
  [ComplexityType.HARD]: "red",
};

const getRating = (sourceText?: string, speechText?: string) => {
  if (!sourceText || !speechText) {
    return 0;
  }
  const correctWords = sourceText
    ?.toLocaleLowerCase()
    .replaceAll(/(.,!)/g, "")
    .replace("?", "")
    .trim()
    .split(" ");
  const words = speechText
    ?.toLocaleLowerCase()
    .replaceAll(/(.,!)/g, "")
    .trim()
    .split(" ");

  const correctCount = words.reduce(
    (acc, curr) => acc + Number(correctWords.includes(curr)),
    0
  );
  const correctAllPhrase = words.join(" ") === correctWords.join(" ");
  return correctWords.length === 0
    ? 0
    : (correctCount / correctWords.length) * 80 + (correctAllPhrase ? 20 : 0);
};

const { Text, Title } = Typography;

function PhrasePage() {
  const router = useRouter();
  const { pid } = router.query as { pid: string };
  const { transcript, listening, isMicrophoneAvailable, finalTranscript } =
    useSpeechRecognition();
  const { user } = useStoreon<State, Events>("user");
  const queryClient = useQueryClient();

  const userId = user?.id || "";

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ["hystory", pid],
    queryFn: () => getHystoryById(pid),
    enabled: Boolean(pid),
  });

  const { mutate: updateHystory } = useMutation({
    mutationFn: updatePhrace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hystoryAll"] });
    },
  });

  const handleListenClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening();
    }
  };

  useEffect(() => {
    if (!finalTranscript || !data) {
      return;
    }
    updateHystory({
      phraseId: data.phraseId,
      skipped: false,
      result: getRating(data.phrase.text, finalTranscript),
      userId,
    });
  }, [data, finalTranscript, updateHystory, userId]);

  const currentRating = data ? getRating(data.phrase.text, finalTranscript) : 0;

  return (
    <>
      <Head>
        <title>Фраза</title>
      </Head>
      <Header />
      <main style={{ flexDirection: "column" }} className={styles.content}>
        <div
          style={{
            boxShadow: "0px 0px 38px 5px rgba(34, 60, 80, 0.2)",
            backgroundColor: "white",
            borderRadius: "1em",
            padding: "1em",
            width: 400,
            height: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {isLoading && <Spinner />}
          {!isLoading && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "absolute",
                  top: "1em",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                {data && (
                  <Tag
                    style={{ marginBottom: "1em" }}
                    color={complexityColor[data?.phrase.complexity]}
                  >
                    {ComplexityType[data?.phrase.complexity].toUpperCase()}
                  </Tag>
                )}
                <Text
                  style={{
                    fontSize: "1.5em",
                    color: getRatingColor(currentRating),
                  }}
                >
                  {currentRating.toFixed(2)}%
                </Text>
              </div>
              <Title
                style={{ textAlign: "center", margin: "0 0 1em 0" }}
                level={3}
              >
                {data?.phrase.text}
              </Title>
              <Title
                style={{
                  textAlign: "center",
                  margin: "0 0 1em 0",
                  color: "blue",
                }}
                level={4}
              >
                {transcript}
              </Title>
              <Button
                style={{ height: "5em", width: "5em", borderRadius: "50%" }}
                type={listening ? "primary" : "default"}
                size="large"
                onClick={handleListenClick}
                disabled={!isMicrophoneAvailable}
              >
                <AudioOutlined style={{ fontSize: "2em" }} />
              </Button>
              <Link
                style={{
                  position: "absolute",
                  bottom: "1em",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
                href="/training"
              >
                <Button>К тренировкам</Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default PhrasePage;
