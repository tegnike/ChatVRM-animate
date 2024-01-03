import fetch from 'cross-fetch';
import { getChatResponse } from "@/features/chat/openAiChat";
import { Message } from "../messages/messages";
import { convertBVHToVRMAnimation } from '@/lib/bvh-converter/convertBVHToVRMAnimation';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';

interface FileBlob {
  blob: Buffer;
  name: string;
}
interface ResponseType {
  bvh: string;
}

export async function createAnime(message: string, openAiKey: string) {
  let vrmaBlob: FileBlob | null = null;
  const bvhLoader = new BVHLoader();

  const messages: Message[] = [
    {
      role: "system",
      content: `受け取った文章を元に、動作のモーションプロンプトを例を参考にして作成してください。

      #例1
      ##受け取った文章
      [happy] 今日も一日楽しかったな
      ##回答
      A person is happy and jumpping.
      
      #例2
      ##受け取った文章
      [sad] 飼っていたハムスターが死んじゃってね、とっても悲しいんだ
      ##回答
      A person is sad and crying.
      
      #例3
      ##受け取った文章
      [normal] 今度の魔法試験でもきっと僕が一番さ
      ##回答
      A person stretches his right arm forward and twirls it around.`,
    },
    {
      role: "user",
      content: message
    }
  ];

  const prompt = await getChatResponse(messages, openAiKey).catch(
    (e) => {
      console.error(e);
      return null;
    }
  );

  if (!prompt) {
    return null;
  }

  // extは現在の時刻
  const ext = Date.now().toString();
  const res = await fetch("/api/momask", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      prompt: prompt.message,
      ext: ext
    })
  });

  const response = await res.json() as ResponseType;

  if (res.status !== 200 || !response || !response.bvh) {
    return null;
  }

  const bvh = bvhLoader.parse(response.bvh);
  const vrmaArrayBuffer = await convertBVHToVRMAnimation(bvh);
  const vrmaBuffer = Buffer.from(vrmaArrayBuffer);
  vrmaBlob = { blob: vrmaBuffer, name: ext };

  // Blobオブジェクトを作成
  const blob = new Blob([vrmaBlob.blob], { type: 'application/octet-stream' });

  // BlobオブジェクトからURLを生成
  const url = URL.createObjectURL(blob);

  // URLを返す
  return url;
}
