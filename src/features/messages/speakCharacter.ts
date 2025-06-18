import { wait } from "@/utils/wait";
import { synthesizeVoiceApi } from "./synthesizeVoice";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";
import { Talk } from "./messages";
import axios from "axios";

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    viewer: Viewer,
    koeiroApiKey: string,
    onStart?: () => void,
    onComplete?: () => void
  ) => {
    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await fetchAudio(screenplay.talk, koeiroApiKey).catch(
        () => null
      );
      lastTime = Date.now();
      return buffer;
    });

    prevFetchPromise = fetchPromise;
    prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
      ([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          return;
        }
        return viewer.model?.speak(audioBuffer, screenplay);
      }
    );
    prevSpeakPromise.then(() => {
      onComplete?.();
    });
  };
};

export const speakCharacter = createSpeakCharacter();

async function synthesizeVoiceAivisSpeech(
  text: string,
  speaker: string = "3",
  speed: number = 1.0,
  pitch: number = 0.0,
  intonation: number = 1.0,
  serverUrl: string = "http://localhost:10101"
): Promise<ArrayBuffer> {
  try {
    // 1. Audio Query の生成
    const queryResponse = await axios.post(
      `${serverUrl}/audio_query?speaker=${speaker}&text=${encodeURIComponent(text)}`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const queryData = queryResponse.data;
    queryData.speedScale = speed;
    queryData.pitchScale = pitch;
    queryData.intonationScale = intonation;

    // 2. 音声合成
    const synthesisResponse = await axios.post(
      `${serverUrl}/synthesis?speaker=${speaker}`,
      queryData,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'audio/wav',
        },
        responseType: 'arraybuffer',
        timeout: 30000,
      }
    );

    return synthesisResponse.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`AivisSpeechでエラーが発生しました: ${error.message}`);
    } else {
      throw new Error('AivisSpeechで不明なエラーが発生しました');
    }
  }
}

export const fetchAudio = async (
  talk: Talk,
  apiKey: string
): Promise<ArrayBuffer> => {
  // AivisSpeechを使用（ハードコードされたオプション）
  const buffer = await synthesizeVoiceAivisSpeech(
    talk.message,
    "3", // speaker
    1.0, // speed
    0.0, // pitch
    1.0, // intonation
    "http://localhost:10101" // serverUrl
  );
  return buffer;
};
