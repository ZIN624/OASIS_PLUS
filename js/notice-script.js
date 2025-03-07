// notice

console.log("JS読み込み完了"); // ページ読み込み時に確認

const agreeCheck = document.getElementById('agreeCheck');
const agreeBtn = document.getElementById('agreeBtn');

agreeCheck.addEventListener('change', () => {
  console.log("チェックボックスの状態が変わった");

  if (agreeCheck.checked) {
    console.log("チェック入りました！");
    agreeBtn.classList.add('active');
  } else {
    console.log("チェック外れました！");
    agreeBtn.classList.remove('active');
  }
});
