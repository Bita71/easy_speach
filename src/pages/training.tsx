import Head from "next/head";
import "babel-polyfill";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import styles from "@/styles/common.module.css";
import { Header, Spinner } from "@/components";
import { Button, Select, Typography } from "antd";
import { ComplexityType, Phrase } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPhrasesForUser } from "@/helpers/training";
import { useStoreon } from "storeon/react";
import { Events, State } from "@/store";
import { AudioOutlined, RightOutlined } from "@ant-design/icons";
import { updatePhrace } from "@/helpers/hystory";

const options = [
  { value: ComplexityType.EASY, label: "Легкие" },
  { value: ComplexityType.MEDIUM, label: "Средние" },
  { value: ComplexityType.HARD, label: "Сложные" },
];

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

function Training() {
  const {
    transcript,
    listening,
    isMicrophoneAvailable,
    finalTranscript,
    resetTranscript,
  } = useSpeechRecognition();
  const [selectValue, setSelectValue] = useState(ComplexityType.EASY);
  const [isTried, setIsTried] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState<Phrase | null>(null);
  const { user } = useStoreon<State, Events>("user");
  const queryClient = useQueryClient();

  const userId = user?.id || "";

  const { data, isFetching: isLoading } = useQuery({
    queryKey: ["training", userId, selectValue],
    queryFn: () => getPhrasesForUser({ userId, complexity: selectValue }),
    enabled: Boolean(userId),
  });

  const { mutate: updateHystory } = useMutation({
    mutationFn: updatePhrace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hystoryAll"] });
    },
  });

  useEffect(() => {
    if (!data || !data[0]) {
      setCurrentPhrase(null);
      return;
    }
    setCurrentPhrase(data[0]);
  }, [data]);

  const handleListenClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      setIsTried(true);
      SpeechRecognition.startListening();
    }
  };

  useEffect(() => {
    if (!finalTranscript || !currentPhrase || !isTried) {
      return;
    }
    updateHystory({
      phraseId: currentPhrase.id,
      skipped: false,
      result: getRating(currentPhrase.text, finalTranscript),
      userId,
    });
  }, [currentPhrase, finalTranscript, isTried, updateHystory, userId]);

  const rating = getRating(currentPhrase?.text, transcript);

  const isEmpty = !data?.length;
  const currentComplexityLabel = options.find(
    ({ value }) => value === selectValue
  )?.label;

  let ratingColor = "red";
  if (rating >= 70) {
    ratingColor = "green";
  } else if (rating >= 40) {
    ratingColor = "orange";
  }

  const handleContinue = () => {
    if (!currentPhrase || !data) {
      return;
    }
    updateHystory({
      phraseId: currentPhrase.id,
      skipped: false,
      result: rating,
      userId,
    });
    resetTranscript();
    setIsTried(false);
    const nextPhrase = data[data.indexOf(currentPhrase) + 1];
    if (!nextPhrase) {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      return;
    }
    setCurrentPhrase(nextPhrase);
  };

  const handleSkip = () => {
    if (!currentPhrase || !data) {
      return;
    }
    updateHystory({
      phraseId: currentPhrase.id,
      skipped: true,
      result: 0,
      userId,
    });
    resetTranscript();
    setIsTried(false);
    const nextPhrase = data[data.indexOf(currentPhrase) + 1];
    if (!nextPhrase) {
      queryClient.invalidateQueries({ queryKey: ["training"] });
      return;
    }
    setCurrentPhrase(nextPhrase);
  };

  return (
    <>
      <Head>
        <title>Тренировка</title>
      </Head>
      <Header />
      <main style={{ flexDirection: "column" }} className={styles.content}>
        <div
          style={{
            boxShadow: "0px 0px 38px 5px rgba(34, 60, 80, 0.2)",
            backgroundColor: "white",
            borderRadius: "1em",
            padding: "1em",
            marginBottom: "2em",
            width: 400,
            display: "flex",
            gap: "1em",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Сложность</Text>
          <Select
            value={selectValue}
            style={{ width: 150 }}
            onChange={setSelectValue}
            options={options}
          />
        </div>
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
          {!isLoading && isEmpty && (
            <Text>{currentComplexityLabel} фразы закончились</Text>
          )}
          {!isLoading && !isEmpty && (
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
                <Text
                  style={{
                    fontSize: "1.5em",
                    color: ratingColor,
                  }}
                >
                  {rating.toFixed(2)}%
                </Text>
              </div>
              <Title
                style={{ textAlign: "center", margin: "0 0 1em 0" }}
                level={3}
              >
                {currentPhrase?.text}
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
              <Button
                style={{
                  position: "absolute",
                  bottom: "1em",
                  left: "50%",
                  transform: "translateX(-50%)",
                  color: isTried ? "green" : "gray",
                  borderColor: isTried ? "green" : "gray",
                }}
                disabled={listening}
                onClick={isTried ? handleContinue : handleSkip}
              >
                {isTried ? "Дальше" : "Пропустить"} <RightOutlined />
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Training;
