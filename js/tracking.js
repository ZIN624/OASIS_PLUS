// js/tracking.js

document.addEventListener("DOMContentLoaded", () => {
  // =========== 設定 ===========
  // TODO: ここにGASで発行したWebhook URLを貼り付けます
  const WEBHOOK_URL =
    "https://script.google.com/macros/s/AKfycbxgM-piA5O3Sl7-y-5ynl0D4V1SRsjemrwkIABwxwKhKBgTgCp71U524w_byZMXKVY4/exec";
  // ============================

  // セッションIDの生成（ブラウザリロード等でも破棄されるため、その時のアクセス単位）
  let sessionId = sessionStorage.getItem("tracking_session_id");
  if (!sessionId) {
    sessionId =
      "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("tracking_session_id", sessionId);
  }

  // 測定開始時間
  const startTime = Date.now();
  let lastInteractedId = "ページ読み込み";

  // フォームデータの収集関数
  const collectFormData = () => {
    const formData = {};

    // 取得したい各項目の値を収集（index.htmlのIDに基づいています）
    const fields = [
      "username",
      "furigana",
      "phoneNumber",
      "day1",
      "time1",
      "selectedMenuInput",
      "otherMenuInput",
      "selectedStylistInput",
      "comments",
    ];

    fields.forEach((id) => {
      const el = document.getElementById(id);
      if (el) formData[id.replace("Input", "")] = el.value; // ex: selectedMenuInput -> selectedMenu
    });

    // 性別ラジオボタン
    const genderEl = document.querySelector('input[name="gender"]:checked');
    if (genderEl) formData.gender = genderEl.value;

    return formData;
  };

  // GASへのデータ送信関数（連続送信を防ぐため少し間引き・あるいは非同期で送る）
  let timeoutId = null;
  const sendTrackingData = () => {
    // もしWebhook URLが未設定なら処理しない
    if (WEBHOOK_URL === "YOUR_GAS_WEBHOOK_URL_HERE") return;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      const timeElapsed = Math.floor((Date.now() - startTime) / 1000); // 経過秒数
      const payload = {
        sessionId: sessionId,
        timeElapsed: timeElapsed,
        lastInteracted: lastInteractedId,
        formData: collectFormData(),
      };

      // CORSのPreflightリクエストを回避するため、"text/plain" で送信します。
      // サーバー(GAS)側でJSONとしてパースさせます。
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify(payload),
        keepalive: true, // ページ離脱時にも送信を保証しやすくする
      }).catch((e) => console.error("Tracking send error", e));
    }, 1000); // 各入力から1秒後に送信（上書き更新）
  };

  // 入力項目の監視
  const monitorElements = document.querySelectorAll("input, select, textarea");
  monitorElements.forEach((el) => {
    // キーボード入力やプルダウン変更時に送信
    el.addEventListener("input", (e) => {
      lastInteractedId = e.target.id || e.target.name || "名称未定義の入力欄";
      sendTrackingData();
    });

    // フォーカスが外れた時にも送信
    el.addEventListener("blur", (e) => {
      lastInteractedId =
        (e.target.id || e.target.name || "名称未定義の入力欄") + " (入力完了)";
      sendTrackingData();
    });
  });

  // メニューや担当者カード（DIVのクリック）も監視
  const cards = document.querySelectorAll(".menu-card, .stylist-card");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.classList.contains("menu-card") ? "メニュー" : "担当者";
      const value =
        card.getAttribute("data-menu") || card.getAttribute("data-stylist");
      lastInteractedId = `${type}: ${value}`;
      sendTrackingData();
    });
  });

  // ページから離脱するとき（タブ閉じなど）にも最後の状態を送信
  window.addEventListener("beforeunload", () => {
    lastInteractedId = "離脱・ページ閉じ";
    sendTrackingData();
  });
});
