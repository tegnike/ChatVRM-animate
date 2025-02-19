# ChatVRM-animate

ChatVRM-animateは、ブラウザウィンドウにドロップすることで、.vrmaおよびM.fbx (Mixamoなど) アニメーションを読み込むことができるChatVRMのフォークです。

- FBX アニメーション
    - [@pixiv/three-vrm/examples/humanoidAnimation](https://github.com/pixiv/three-vrm/tree/dev/packages/three-vrm/examples/humanoidAnimation)

## MoMask対応

ニケによりさらに以下の改良がされています。

- テキストを入力すると、返答内容に合わせて[MoMask](https://github.com/EricGuo5513/momask-codes)によるリアルタイムモーション生成が実行されます。

### 実行方法

1. MoMask動作環境をlibフォルダ内に作成してください。 `lib/momask-codes/` のようになるはずです。
   READMEでも良いですが、[猩々博士の記事](https://note.com/mega_gorilla/n/n9657a9172ec2)も参考になりました。
   `python gen_t2m.py` を実行して、bvhファイルが作成されれば問題ないと思います。
2. `src\pages\api\momask.ts` の9行目のpythonの実行パスを変更してください。
3. 以降は下記のChatVRMの方法に倣って進めてください。

※ Windows x anaconda環境でのみ動作を確認しています。

## ChatVRM

ChatVRMはブラウザで簡単に3Dキャラクターと会話ができるデモアプリケーションです。

VRMファイルをインポートしてキャラクターに合わせた声の調整や、感情表現を含んだ返答文の生成などを行うことができます。

ChatVRMの各機能は主に以下の技術を使用しています。

- ユーザーの音声の認識
    - [Web Speech API(SpeechRecognition)](https://developer.mozilla.org/ja/docs/Web/API/SpeechRecognition)
- 返答文の生成
    - [ChatGPT API](https://platform.openai.com/docs/api-reference/chat)
- 読み上げ音声の生成
    - [Koemotion/Koeiromap API](https://koemotion.rinna.co.jp/)
- 3Dキャラクターの表示
    - [@pixiv/three-vrm](https://github.com/pixiv/three-vrm)

## デモ: オリジナルのChatVRM

Glitchでデモを公開しています。

[https://chatvrm.glitch.me](https://chatvrm.glitch.me)

## 実行
ローカル環境で実行する場合はこのリポジトリをクローンするか、ダウンロードしてください。

```bash
git@github.com:susurobo/ChatVRM-animate.git
```

必要なパッケージをインストールしてください。
```bash
npm install
```

パッケージのインストールが完了した後、以下のコマンドで開発用のWebサーバーを起動します。
```bash
npm run dev
```

実行後、以下のURLにアクセスして動作を確認して下さい。

[http://localhost:3000](http://localhost:3000) 


---

## ChatGPT API

ChatVRMでは返答文の生成にChatGPT APIを使用しています。

ChatGPT APIの仕様や利用規約については以下のリンクや公式サイトをご確認ください。

- [https://platform.openai.com/docs/api-reference/chat](https://platform.openai.com/docs/api-reference/chat)
- [https://openai.com/policies/api-data-usage-policies](https://openai.com/policies/api-data-usage-policies)


## Koeiromap API
ChatVRMでは返答文の音声読み上げにKoemotionのKoeiromap APIを使用しています。

Koeiromap APIの仕様や利用規約については以下のリンクや公式サイトをご確認ください。

- [https://koemotion.rinna.co.jp/](https://koemotion.rinna.co.jp/)