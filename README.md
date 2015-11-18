# クライアントからサーバーへpingを送るとサーバがpongを返すWebRTC(DataChannel)のサンプル

以下のページ、コードを参考にしました。
* https://html5experts.jp/mganeko/5181/
* https://github.com/js-platform/node-webrtc/blob/develop/examples/ping-pong-test.js

※: stunサーバーを使ってないので、ローカルネットじゃないとつながらないと思います。

## 使い方

### サーバー

nodejs 0.12で動作確認しました。

```
git clone git@github.com:yuuichi-fujioka/ping-pong-webrtc.git
cd ping-pong-webrtc
npm install ./
node pong.js
```

### クライアント

何とかして ``` html/index.html ``` を開いてください。

例:dokcerを使ってサーバーを建てる

```
docker run -ti --rm -p 80:80 -v "$(readlink -f html):/usr/share/nginx/html:ro" nginx
```


### 操作

1. ブラウザでクライアントの画面を開く
2. サーバーを起動する
 SDPとICE Candidateが表示されるので、SDPをコピーする
3. ブラウザのSDP to receiveのテキストボックスにSDPをペーストし、Receive SDPボタンを押す
 SDP to sendのテキストボックスにAnswerのSDPが表示されるので、コピーする
4. サーバーのコンソールにペーストし、改行。waitingと表示されれば、OK
5. ブラウザのICE Candidate to sendのテキストボックスに表示されているものをすべてコピーし、サーバーのコンソールにペーストし、改行。エラーが出なければOK
6. サーバーのICE Candidateをコピーし、ブラウザのICE Candidates to receiveのテキストボックスに張り付け、Recieve ICE Candidatesボタンを押下
7. ブラウザのPingボタンを押下。
 ブラウザのコンソールにpongが帰ってきている的なメッセージが表示されれば、成功
