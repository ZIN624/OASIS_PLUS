(function () {
  if (!window.liff) return;

  liff
    .init({
      liffId: "2006595194-AkL3pQ0D",
    })
    .then(() => {
      console.log("LIFF initialized");
    })
    .catch((error) => {
      console.error("LIFF init error:", error);
      alert("LIFFの初期化に失敗しました。通信環境やLINEアプリ内表示をご確認ください。");
    });
})();
