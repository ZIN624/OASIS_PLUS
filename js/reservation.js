(function () {
  function getPreferences() {
    return ["1", "2", "3"]
      .map((num) => {
        const date = document.getElementById(`day${num}`)?.value || "";
        const time = document.getElementById(`time${num}`)?.value || "";
        return { index: num, date, time };
      })
      .filter((p) => p.date && p.time);
  }

  function collectReservationData() {
    const customer = window.CustomerStorage?.getCustomer() || {};
    const selectedMenu = document.getElementById("selectedMenuInput")?.value.trim() || "";
    const customerStatus = window.AppState?.customerStatus || localStorage.getItem("customerStatus") || "新規";

    return {
      customer,
      customerStatus,
      menu: selectedMenu,
      otherMenu: document.getElementById("otherMenuInput")?.value.trim() || "",
      stylist: document.getElementById("selectedStylistInput")?.value.trim() || "",
      preferences: getPreferences(),
      comments: document.getElementById("comments")?.value.trim() || "",
    };
  }

  function buildSummaryHtml(data) {
    const menuText = data.menu === "その他" ? `その他: ${data.otherMenu || "未入力"}` : data.menu;

    return `
      <p><strong>予約者名:</strong> ${data.customer.username || "未登録"}</p>
      <p><strong>フリガナ:</strong> ${data.customer.furigana || "未登録"}</p>
      <p><strong>性別:</strong> ${data.customer.gender || "未登録"}</p>
      <p><strong>ステータス:</strong> ${data.customerStatus || "新規"}</p>
      <p><strong>電話番号:</strong> ${data.customer.phoneNumber || "未登録"}</p>
      <p><strong>メニュー:</strong> ${menuText || "未選択"}</p>
      <p><strong>担当スタイリスト:</strong> ${data.stylist || "未選択"}</p>
      ${data.preferences
        .map((p, i) => `<p><strong>第${i + 1}希望:</strong> ${p.date} ${p.time}</p>`)
        .join("")}
      <p><strong>備考:</strong> ${data.comments || "なし"}</p>
    `;
  }

  function buildLineMessage(data) {
    const menuText = data.menu === "その他" ? `${data.otherMenu || "未入力"}` : data.menu;

    return [
      "予約希望メッセージ",
      `予約者名: ${data.customer.username || "未登録"}`,
      `フリガナ: ${data.customer.furigana || "未登録"}`,
      `性別: ${data.customer.gender || "未登録"}`,
      `ステータス: ${data.customerStatus || "新規"}`,
      `電話番号: ${data.customer.phoneNumber || "未登録"}`,
      `メニュー: ${menuText || "未選択"}`,
      `担当スタイリスト: ${data.stylist || "未選択"}`,
      ...data.preferences.map((p, i) => `第${i + 1}希望: ${p.date} ${p.time}`),
      `備考: ${data.comments || "なし"}`,
      "",
      "ご予約希望ありがとうございます！",
      "確認いたしますのでお待ちください！",
    ].join("\n");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const submitReservationBtn = document.getElementById("submitReservation");
    const editReservationBtn = document.getElementById("editReservation");
    const submitBtn = document.getElementById("submitbtn");

    const reservationForm = document.getElementById("reservationForm");
    const reservationSummary = document.getElementById("reservationSummary");
    const summaryDetails = document.getElementById("summaryDetails");
    const summaryScrollHint = document.getElementById("summaryScrollHint");
    const formArea = document.getElementById("formArea");

    let latestReservationData = null;
    let isSubmitButtonVisible = false;

    function setSummaryHintVisible(visible) {
      if (!summaryScrollHint) return;
      summaryScrollHint.classList.toggle("is-visible", visible);
    }

    function isSummaryMode() {
      return reservationSummary && reservationSummary.style.display === "block";
    }

    function refreshSummaryHint() {
      setSummaryHintVisible(Boolean(isSummaryMode() && !isSubmitButtonVisible));
    }

    const submitBtnObserver =
      typeof IntersectionObserver !== "undefined" && submitBtn
        ? new IntersectionObserver(
            (entries) => {
              const [entry] = entries;
              isSubmitButtonVisible = Boolean(entry?.isIntersecting);
              refreshSummaryHint();
            },
            {
              root: null,
              threshold: 0.15,
            }
          )
        : null;

    if (submitBtnObserver && submitBtn) {
      submitBtnObserver.observe(submitBtn);
    } else {
      const fallbackCheck = () => {
        if (!submitBtn) return;
        const rect = submitBtn.getBoundingClientRect();
        isSubmitButtonVisible = rect.top < window.innerHeight && rect.bottom > 0;
        refreshSummaryHint();
      };
      window.addEventListener("scroll", fallbackCheck, { passive: true });
      window.addEventListener("resize", fallbackCheck);
      fallbackCheck();
    }

    submitReservationBtn?.addEventListener("click", (event) => {
      event.preventDefault();

      const customer = window.CustomerStorage?.getCustomer();
      if (!customer?.username || !customer?.furigana || !customer?.gender || !customer?.phoneNumber) {
        alert("顧客情報が見つかりません。先に顧客情報を登録してください。");
        return;
      }

      if (!window.FormValidator?.validateReservationForm()) return;

      latestReservationData = collectReservationData();

      if (summaryDetails) {
        summaryDetails.innerHTML = buildSummaryHtml(latestReservationData);
      }

      if (reservationForm) reservationForm.style.display = "none";
      if (reservationSummary) reservationSummary.style.display = "block";

      formArea?.scrollIntoView({ behavior: "smooth", block: "start" });
      refreshSummaryHint();
    });

    editReservationBtn?.addEventListener("click", () => {
      if (reservationSummary) reservationSummary.style.display = "none";
      if (reservationForm) reservationForm.style.display = "block";
      refreshSummaryHint();
    });

    submitBtn?.addEventListener("click", () => {
      const agreeChecked = document.getElementById("agreeCheckbox")?.checked;
      if (!agreeChecked) {
        alert("送信ができていません。同意事項をチェックマーク入れてください。");
        return;
      }

      if (!latestReservationData) {
        alert("予約内容を確認してから送信してください。");
        return;
      }

      const message = buildLineMessage(latestReservationData);

      if (!window.liff || typeof liff.sendMessages !== "function") {
        alert("LINE送信機能が利用できません。環境を確認してください。");
        return;
      }

      liff
        .sendMessages([{ type: "text", text: message }])
        .then(() => {
          alert("予約内容を送信しました。");
          setSummaryHintVisible(false);
          if (typeof liff.closeWindow === "function") {
            liff.closeWindow();
          }
        })
        .catch((error) => {
          alert(`送信エラー: ${error.message}`);
        });
    });

    refreshSummaryHint();
  });
})();
