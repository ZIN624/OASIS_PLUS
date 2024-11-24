// 月の選択に応じて、対応する日数を更新
function updateDays(month, daySelectId) {
  const daySelect = document.getElementById(daySelectId);
  // month - 1 として、正しい月のインデックスを使って日数を取得
  const daysInMonth = new Date(2024, month, 0).getDate(); // 月に応じた日数を取得

  // 現在のオプションをクリア
  daySelect.innerHTML = '';

  // 1日から最大日数までの選択肢を作成
  for (let i = 1; i <= daysInMonth; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i}日`;
    daySelect.appendChild(option);
  }
}

// 月が変更されたときに日付を更新
document.getElementById("month1").addEventListener("change", function() {
  updateDays(parseInt(this.value), "day1"); // parseIntで数値に変換
});
document.getElementById("month2").addEventListener("change", function() {
  updateDays(parseInt(this.value), "day2"); // parseIntで数値に変換
});
document.getElementById("month3").addEventListener("change", function() {
  updateDays(parseInt(this.value), "day3"); // parseIntで数値に変換
});

// ページが読み込まれたときに初期化
window.addEventListener('load', function() {
  // 初期の月が選択された状態で日付を設定
  updateDays(parseInt(document.getElementById("month1").value), "day1");
  updateDays(parseInt(document.getElementById("month2").value), "day2");
  updateDays(parseInt(document.getElementById("month3").value), "day3");
});
 function toggleOtherInput() {
    const menu = document.getElementById("menu");
    const otherInputContainer = document.getElementById("other-input-container");
    if (menu.value === "other") {
      otherInputContainer.style.display = "block";
    } else {
      otherInputContainer.style.display = "none";
    }
  }
