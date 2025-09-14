// ここからコードを書いてください
function setupTabs() {
  // すべてのタブメニュー要素を取得
  const menuItems = document.querySelectorAll(".tab-item");

  // すべてのコンテンツセクション要素を取得
  const contentSections = document.querySelectorAll(".content-section");

  // 各メニュー項目にイベントリスナーを登録
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      // クリックされたタブのIDを取得
      const targetTabId = item.dataset.tab;
      // console.log(targetTabId);

      // すべてのセクションを非表示にする
      contentSections.forEach((section) => {
        section.classList.add("hidden");
      });

      // クリックされたタブに対応するセクションを表示する
      const targetSection = document.getElementById(targetTabId);
      if (targetSection) {
        // 念のため要素が存在するかチェック
        targetSection.classList.remove("hidden");
      }
    });
  });
}

export default setupTabs;
