function doPost(e) {
  // アクセスされたスプレッドシートのアクティブなシートを取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 送信されたデータをJSON形式でパース
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"error": "Invalid JSON"}))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var sessionId = data.sessionId;
  // 更新日時
  var lastUpdated = new Date();
  // 経過時間（秒）
  var timeElapsed = data.timeElapsed || 0;
  // 最後に操作した項目
  var lastInteracted = data.lastInteracted || "";
  
  var formData = data.formData || {};
  
  // シートに書き込む配列（A列〜N列）
  // ※スプレッドシートの1行目（ヘッダー）はご自身で以下に合わせて設定してください。
  // A: SessionID, B: 更新日時, C: 滞在時間(秒), D: 最終入力項目, E: 予約者名, F: フリガナ, G: 性別, H: 電話番号, I: 予約日(第1), J: 予約時間(第1), K: メニュー, L: 担当者, M: 備考, N: その他メニュー
  var rowData = [
    sessionId, 
    lastUpdated, 
    timeElapsed + "秒", 
    lastInteracted, 
    formData.username || "",
    formData.furigana || "",
    formData.gender || "",
    formData.phoneNumber || "",
    formData.day1 || "",
    formData.time1 || "",
    formData.menu || "",
    formData.stylist || "",
    formData.comments || "",
    formData.otherMenu || ""
  ];
  
  // SessionIDが既に存在するかA列を検索
  var searchRange = sheet.getRange("A:A").getValues();
  var rowIndex = -1;
  for (var i = 0; i < searchRange.length; i++) {
    if (searchRange[i][0] === sessionId) {
      rowIndex = i + 1; // GASは1行目から始まるため+1
      break;
    }
  }
  
  if (rowIndex === -1) {
    // 存在しない場合は新規追加
    sheet.appendRow(rowData);
  } else {
    // 存在する場合はその行を上書き（リアルタイム更新）
    sheet.getRange(rowIndex, 1, 1, rowData.length).setValues([rowData]);
  }
  
  // 成功を返す
  return ContentService.createTextOutput(JSON.stringify({status: "success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
