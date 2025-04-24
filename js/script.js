liff.init({
  liffId: '2006595194-AkL3pQ0D',
}).then(() => {
  console.log('LIFF初期化成功');
  console.log('LIFF環境情報:', {
    isInClient: liff.isInClient(),
    isLoggedIn: liff.isLoggedIn(),
    language: liff.getLanguage(),
    context: liff.getContext()
  });
}).catch((error) => {
  console.error('LIFF初期化エラー:', error);
  console.error('エラー詳細:', JSON.stringify(error, null, 2));
  alert('LIFF初期化に失敗しました。以下の点を確認してください：\n' +
        '1. インターネット接続\n' +
        '2. LINEアプリ内で開いているか\n' +
        '3. LIFF IDが正しいか');
});



// 最初の同意事項

// 同意チェックとボタン有効化
const agreeCheck = document.getElementById('agreeCheck');
const agreeBtn = document.getElementById('agreeBtn');
const noticeArea = document.getElementById('noticeArea');
const formArea = document.getElementById('formArea');
const submitagree = document.getElementById('submitbtn')


agreeCheck.addEventListener('change', () => {
  if (agreeCheck.checked) {
    agreeBtn.classList.add('active');
  } else {
    agreeBtn.classList.remove('active');
  }
});

// 送信ボタン関係
// .addEventListener('change', () => {
//   if (agreeCheck.checked) {
//     agreeBtn.classList.add('active');
//   } else {
//     agreeBtn.classList.remove('active');
//   }
// });

// 同意ボタンを押したときの処理
agreeBtn.addEventListener('click', () => {
  // 同意画面を非表示
  noticeArea.style.display = 'none';
  // フォームを表示
  formArea.style.display = 'block';
  // フォームの先頭までスクロール
  formArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
});



// 働く日はここで管理だよ------！！！


// 特別営業日と休業日の定義
const specialWorkingDays = ['2025-05-05'];
const holidays = ['2024-12-31', '2025-01-01', '2025-01-02','2025-01-03','2025-01-12',2025-05-04,];
function generateDates(maxDays = 180) {
  const today = new Date();
  const dates = [];







  // 今日の日付の基準をUTC 0時に固定
  const startDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  for (let i = 0; i < maxDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setUTCDate(startDate.getUTCDate() + i); // UTC日付を計算

    const dayOfWeek = currentDate.getUTCDay(); // UTCベースの曜日を取得
    const formattedDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD形式

    // 月曜・火曜、または休業日はスキップ
    if (dayOfWeek === 1 || dayOfWeek === 2 || holidays.includes(formattedDate)) continue;

    dates.push({
      date: formattedDate,
      weekday: ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  // 特別営業日を追加してソート
  specialWorkingDays.forEach((day) => {
    if (!dates.some((d) => d.date === day)) {
      const specialDate = new Date(day);
      dates.push({
        date: day,
        weekday: ["日", "月", "火", "水", "木", "金", "土"][specialDate.getDay()],
        isWeekend: specialDate.getDay() === 0 || specialDate.getDay() === 6,
      });
    }
  });

  // 日付順にソート
  return dates.sort((a, b) => new Date(a.date) - new Date(b.date));
}


// セレクトボックスに日付を反映
function populateDateOptions(selectId) {
  const daySelect = document.getElementById(selectId);
  const dates = generateDates();

  // 既存の選択肢をクリア
  daySelect.innerHTML = '';

  dates.forEach((dateObj, index) => {
    const option = document.createElement('option');
    option.value = dateObj.date;
    option.textContent = `${dateObj.date} (${dateObj.weekday})`;

    // 土日は赤色クラスを適用
    if (dateObj.isWeekend) {
      option.classList.add('red-day');
    }

    // 最初の日付をデフォルト選択
    if (index === 0) {
      option.selected = true;
    }

    daySelect.appendChild(option);
  });
}

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
  populateDateOptions('day1'); // セレクトボックスのIDを指定
});

// 特別営業日を追加
function addSpecialWorkingDay(newDay) {
  if (!specialWorkingDays.includes(newDay)) {
    specialWorkingDays.push(newDay);
    console.log(`特別営業日 ${newDay} を追加しました。`);
    populateDateOptions('day1');
  } else {
    console.warn(`${newDay} は既に特別営業日に含まれています。`);
  }
}

// メニュー選択処理
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => {
      // 全てのメニューカードから選択状態を解除
      document.querySelectorAll('.menu-card').forEach(c => c.classList.remove('selected'));

      // クリックされたメニューカードを選択状態にする
      card.classList.add('selected');

      // 選択されたメニューをhiddenフィールドに設定
      const selectedMenuInput = document.getElementById('selectedMenuInput');
      selectedMenuInput.value = card.dataset.menu;

      // "その他"メニューが選択された場合、入力フィールドを表示
      const otherInputContainer = document.getElementById('other-input-container');
      if (card.dataset.menu === 'その他') {
        otherInputContainer.style.display = 'block';
      } else {
        otherInputContainer.style.display = 'none';
      }
    });
  });
});

// 入力チェック関数
// スタイリスト選択のバリデーションを修正
function validateInputs() {
const username = document.getElementById('username')?.value.trim();
localStorage.setItem("username", username); // 入力内容を保存
if (!username) {
  alert('名前を入力してください。');
  const usernameField = document.getElementById('username');
  usernameField.classList.add('error-field');  // エラークラスを追加
  usernameField.scrollIntoView({ behavior: 'smooth' });  // スクロール
  return false;
} else {
  document.getElementById('username').classList.remove('error-field');  // エラークラスを削除
}


// フリガナのバリデーション
const furigana = document.getElementById('furigana')?.value.trim();
if (!furigana) {
  alert('フリガナを入力してください。');
  const furiganaField = document.getElementById('furigana');
  furiganaField.classList.add('error-field');  // エラークラスを追加
  furiganaField.scrollIntoView({ behavior: 'smooth' });  // スクロール
  return false;
} else {
  document.getElementById('furigana').classList.remove('error-field');  // エラークラスを削除
}

// フリガナの形式チェック
const furiganaPattern = /^[ぁ-んァ-ンー\s]+$/;
if (!furiganaPattern.test(furigana)) {
  alert('フリガナは「ひらがな」と「カタカナ」のみで入力してください。');
  const furiganaField = document.getElementById('furigana');
  furiganaField.classList.add('error-field');  // エラークラスを追加
  furiganaField.scrollIntoView({ behavior: 'smooth' });  // スクロール
  return false;
} else {
  document.getElementById('furigana').classList.remove('error-field');  // エラークラスを削除
}


// 性別のバリデーション
const gender = document.querySelector('input[name="gender"]:checked')?.value;
if (!gender) {
  alert('性別を選択してください。');
  const genderField = document.querySelector('input[name="gender"]');
  genderField.classList.add('error-field');  // エラークラスを追加
  genderField.scrollIntoView({ behavior: 'smooth' });  // スクロール
  return false;
} else {
  document.querySelector('input[name="gender"]').classList.remove('error-field');  // エラークラスを削除
}

// 電話番号のバリデーション
const phone = document.getElementById('phoneNumber')?.value.trim();
if (!phone.match(/^0\d{1,4}-?(\d{1,4}){1,2}-?\d{4}$/)) {
  alert('電話番号は正しい形式で入力してください。');
  const phoneField = document.getElementById('phoneNumber');
  phoneField.classList.add('error-field');  // エラークラスを追加
  phoneField.scrollIntoView({ behavior: 'smooth' });  // スクロール
  return false;
} else {
  document.getElementById('phoneNumber').classList.remove('error-field');  // エラークラスを削除
}
// メニュー選択のバリデーション
// 選択されたメニューカードを取得
const selectedMenuInput = document.querySelector('.menu-card.selected');

if (!selectedMenuInput) {
  alert('ご希望のメニューを選択してください。');
  // メニュー選択部分にスクロール
  document.getElementById('menu-container').scrollIntoView({ behavior: 'smooth' });
  return false;
} else {
  // その他が選択された場合、その他の入力フィールドを表示
  if (selectedMenuInput.dataset.menu === 'その他') {
    // その他の入力フィールドが空の場合、アラートを表示してスクロール
    const otherInput = document.getElementById('その他のメニュー');
    if (!otherInput.value.trim()) {
      alert('その他のメニューをご記入ください。');
      otherInput.classList.add('error-field');
      otherInput.scrollIntoView({ behavior: 'smooth' });
      return false;
    } else {
      otherInput.classList.remove('error-field');
    }
  } else {
    // その他以外が選択された場合、エラークラスを削除
    const otherInput = document.getElementById('その他のメニュー');
    otherInput.classList.remove('error-field');
  }
}


// スタイリスト選択のバリデーション
// 選択されたスタイリストカードを取得
const selectedStylistInput = document.querySelector('.stylist-card.selected');

// スタイリストが選択されていない場合、アラートを表示
if (!selectedStylistInput) {
  alert('担当スタイリストを選択してください。');
  // スタイリストの選択部分にスクロール
  document.getElementById('stylist-container').scrollIntoView({ behavior: 'smooth' });
  return false;
} else {
  document.getElementById('stylist-container').classList.remove('error-field');  // エラークラスを削除
}

return true;
}


// 名前と電話番号の自動入力
const nameInput = document.getElementById("username");
const phoneInput = document.getElementById("phoneNumber");
const furiganaInput = document.getElementById("furigana");
const genderInputs = document.getElementsByName("gender");

// 名前と電話番号の記憶
nameInput.value = localStorage.getItem("username") || '';
phoneInput.value = localStorage.getItem("phoneNumber") || '';
furiganaInput.value = localStorage.getItem("furigana") || '';
const savedGender = localStorage.getItem("gender");
if (savedGender) {
  genderInputs.forEach(input => {
    if (input.value === savedGender) {
      input.checked = true;
    }
  });
}
// 名前と電話番号を保存
nameInput.addEventListener('input', function() {
localStorage.setItem("username", nameInput.value);
});
phoneInput.addEventListener('input', function() {
localStorage.setItem("phoneNumber", phoneInput.value);
});
furiganaInput.addEventListener('input', function() {
  localStorage.setItem("furigana", furiganaInput.value);
});
genderInputs.forEach(input => {
  input.addEventListener('change', function() {
    if (input.checked) {
      localStorage.setItem("gender", input.value);
    }
  });
});
// スタイリスト選択
document.addEventListener('DOMContentLoaded', () => {
document.querySelectorAll('.stylist-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.stylist-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    const selectedStylistInput = document.getElementById('selectedStylistInput');
    if (selectedStylistInput) {
      selectedStylistInput.value = card.dataset.stylist;
    }
  });
});
});

// 第2希望の追加
document.getElementById('addSecondChoice').addEventListener('click', function () {
const secondChoiceDiv = document.getElementById('secondChoice');
if (!secondChoiceDiv.innerHTML) {
  secondChoiceDiv.innerHTML = `
    <h2 class="title">第2希望</h2>
    <div class="input-wrapper">
      <label for="day2" class="input-label">希望日:</label>
      <select id="day2" name="day2" class="input-select" required></select>
    </div>
    <div class="input-wrapper">
      <label for="time2" class="input-label">時間:</label>
      <select id="time2" name="time2" class="input-select" required>
        ${[...Array(10).keys()].map(i => `<option value="${9 + i}:00">${9 + i}:00</option>`).join('')}
      </select>
    </div>`;
  populateDateOptions('day2');
} else {
  secondChoiceDiv.innerHTML = '';
}
});

// 第3希望の追加
document.getElementById('addThirdChoice').addEventListener('click', function () {
const thirdChoiceDiv = document.getElementById('thirdChoice');
if (!thirdChoiceDiv.innerHTML) {
  thirdChoiceDiv.innerHTML = `
    <h2 class="title">第3希望</h2>
    <div class="input-wrapper">
      <label for="day3" class="input-label">希望日:</label>
      <select id="day3" name="day3" class="input-select" required></select>
    </div>
    <div class="input-wrapper">
      <label for="time3" class="input-label">時間:</label>
      <select id="time3" name="time3" class="input-select" required>
        ${[...Array(10).keys()].map(i => `<option value="${9 + i}:00">${9 + i}:00</option>`).join('')}
      </select>
    </div>`;
  populateDateOptions('day3');
} else {
  thirdChoiceDiv.innerHTML = '';
}
});

// 初期化
window.onload = function() {
populateDateOptions('day1');
};

// 予約データを収集する関数
let reservationData = {
  username: document.getElementById('username')?.value.trim(),
  phone: document.getElementById('phoneNumber')?.value.trim(),
  menu: document.getElementById('selectedMenuInput')?.value.trim(),
  stylist: document.getElementById('selectedStylistInput')?.value.trim(),
  furigana: document.getElementById('furigana')?.value.trim(),
  gender: document.querySelector('input[name="gender"]:checked')?.value,
  preferences: ['1', '2', '3'].map(num => ({
    date: document.getElementById(`day${num}`)?.value || '',
    time: document.getElementById(`time${num}`)?.value || ''
  })).filter(pref => pref.date && pref.time),
  comments: document.getElementById('comments')?.value.trim(),
  agree: document.getElementById('agreeCheckbox')?.checked || false
};
// 予約データの収集と表示
document.getElementById('submitReservation').addEventListener('click', function (event) {
  event.preventDefault();

  console.log('送信ボタンがクリックされました');
  console.log('予約データ:', reservationData);  // reservationDataをコンソールに表示
 // 入力チェック
 if (!validateInputs()) return;  // バリデーション関数でエラーがあれば処理を中止

 // 1. 必須項目（名前、電話番号、メニュー、スタイリスト）をチェック
 const username = document.getElementById('username').value.trim();
 const furigana = document.getElementById('furigana')?.value.trim();
 const phone = document.getElementById('phoneNumber').value.trim();
 const selectedMenuInput = document.getElementById('selectedMenuInput').value.trim();
 const stylist = document.getElementById('selectedStylistInput').value.trim();
 const gender = document.querySelector('input[name="gender"]:checked')?.value;
 
 if (!username) {
   alert('名前を入力してください');
   return;
 }
 if (!furigana) {
  alert('フリガナをご記入ください');
  return;
}

if (!gender) {
  alert('性別を選択してください');
  return;
}


 if (!selectedMenuInput) {
   alert('ご希望のメニューを選択してください');
   return;
 }

 if (!stylist) {
   alert('スタイリストを選択してください');
   return;
 }
 if (!phone) {
  alert('電話番号を入力してください');
  return;
}

  // 予約データの収集
  reservationData = {
    username: document.getElementById('username')?.value.trim(),
    phone: document.getElementById('phoneNumber')?.value.trim(),
    selectedMenuInput: document.getElementById('selectedMenuInput')?.value.trim(),
    otherMenuDetails: document.getElementById('その他のメニュー')?.value.trim() || '',
    stylist: document.getElementById('selectedStylistInput')?.value.trim(),
    furigana: document.getElementById('furigana')?.value.trim(),
    gender: document.querySelector('input[name="gender"]:checked')?.value || '',
    preferences: (['1', '2', '3'].map(num => {
      const date = document.getElementById(`day${num}`)?.value || '';
      const time = document.getElementById(`time${num}`)?.value || '';
      return { date, time };
    })).filter(pref => pref.date && pref.time),  // 日付と時間があるもののみフィルタリング

    comments: document.getElementById('comments')?.value.trim()
  }

  console.log('収集した予約データ:', reservationData);  // 再度確認

  // preferences が配列で、空でないかを確認
  if (!Array.isArray(reservationData.preferences) || reservationData.preferences.length === 0) {
    console.error('第1希望、第2希望、第3希望のいずれも入力されていません');
    alert('第1希望、第2希望、第3希望のいずれかを入力してください。');
    return; // preferencesが正しく設定されていない場合は処理を中止
  }

  // 確認内容を整形
// 確認エリアの部分（submitReservationイベントリスナー内）
const detailsHTML = `
  <p><strong>予約者名</strong> ${reservationData.username}</p>
  <p><strong>フリガナ</strong> ${reservationData.furigana || '未入力'}</p>
  <p><strong>性別</strong> ${reservationData.gender || '未選択'}</p>
  <p><strong>電話番号</strong> ${reservationData.phone || '未入力'}</p>
  <p><strong>ご希望メニュー</strong> 
    ${reservationData.selectedMenuInput === 'その他' 
      ? `${reservationData.otherMenuDetails || '未入力'}` 
      : reservationData.selectedMenuInput || '未入力'}
  </p>
  <p><strong>担当者</strong> ${reservationData.stylist || '未入力'}</p>
  ${reservationData.preferences.map((pref, index) => `
    <p><strong>第${index + 1}希望</strong> ${pref.date} ${pref.time}</p>
  `).join('')}
  <p><strong>備考</strong> ${reservationData.comments || "なし"}</p>
`;


  // 確認エリアにデータを設定
  const summaryDetails = document.getElementById('summaryDetails');
  if (!summaryDetails) {
    console.error('summaryDetails 要素が見つかりません！');
    return;
  }
  summaryDetails.innerHTML = detailsHTML;

  // 確認エリアの表示切り替え
  const reservationSummary = document.getElementById('reservationSummary');
  const reservationForm = document.getElementById('reservationForm');
  if (!reservationSummary || !reservationForm) {
    console.error('reservationSummary または reservationForm 要素が見つかりません！');
    return;
  }

  reservationForm.style.display = 'none'; // フォームを非表示
  console.log('予約フォームを非表示にしました');
  reservationSummary.style.display = 'block'; // 確認エリアを表示
  console.log('確認エリアを表示しました');

  console.log('フォームのスタイル:', getComputedStyle(reservationForm).display);
  console.log('確認エリアのスタイル:', getComputedStyle(reservationSummary).display);

   // 確認エリアにスクロールする
   reservationSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });  // スムーズに一番上へスクロール
});






// 編集ボタン
document.getElementById('editReservation').addEventListener('click', function () {
  document.getElementById('reservationSummary').style.display = 'none';
  document.getElementById('reservationForm').style.display = 'block';
});

// 確定ボタン
document.getElementById('agreeCheckbox').addEventListener('click', function () {
  const agreeChecked = document.getElementById('agreeCheckbox').checked;
  if (!agreeChecked) {
    alert('同意事項に同意してください');
    return;
  }
  let message = 'ご予約希望メッセージ\n';

  // 空でないデータのみメッセージに追加
  if (reservationData.username) message += `\n予約者名: ${reservationData.username}様\n`;
  if (reservationData.furigana) message += `フリガナ: ${reservationData.furigana}様\n`;
  if (reservationData.gender) message += `性別: ${reservationData.gender}\n`;
  if (reservationData.phone) message += `電話番号: ${reservationData.phone}\n`;
 // メニューの処理
// LINEに送信するメッセージ（confirmReservationイベントリスナー内）
  if (reservationData.selectedMenuInput === "その他") {
  const otherMenuDetails = reservationData.otherMenuDetails || '（詳細未入力）';
  message += `メニュー:${otherMenuDetails}\n`;
} else {
  message += `メニュー: ${reservationData.selectedMenuInput}\n`;
}
  if (reservationData.stylist) message += `スタイリスト: ${reservationData.stylist}\n`;

  if (Array.isArray(reservationData.preferences) && reservationData.preferences.length > 0) {
    message += `希望日時:\n${reservationData.preferences.map((pref, index) => {
      return `第${index + 1}希望: ${pref.date} ${pref.time}`;
    }).join('\n')}`;
  }

  if (reservationData.comments) message += `備考: ${reservationData.comments}\n`;

  // 最後に追加するメッセージ（感謝と確認のメッセージ）
  message += `\n\nご記入いただきありがとうございます！\nただいま確認いたしますのでお待ちください！🙏⏳`;

  console.log('送信するメッセージ:', message);  // 送信前にメッセージを確認

  // メッセージをLINEに送信
  liff.sendMessages([{
    type: 'text',
    text: message
  }]).then(() => {
    alert('予約希望が送信されました！');
    liff.closeWindow();
  }).catch((error) => {
    alert(`エラー: ${error.message}`);
  });
});
