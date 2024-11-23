document.getElementById("reservationForm").addEventListener("submit", function(event) {
    event.preventDefault(); // フォームのデフォルト動作を停止
    
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const menu = document.getElementById("menu").value;
    const staff = document.getElementById("staff").value;
    const comments = document.getElementById("comments").value;
  
    // 予約データをオブジェクトにまとめる
    const reservationData = {
      date,
      time,
      menu,
      staff,
      comments
    };
  
    // サーバーへ送信
    fetch("https://your-backend-url.com/line-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservationData)
    })
      .then(response => {
        if (response.ok) {
          alert("予約内容がLINEに送信されました！");
        } else {
          alert("LINEへの通知に失敗しました。");
        }
      })
      .catch(error => {
        console.error("エラー:", error);
        alert("エラーが発生しました。");
      });
  });
  