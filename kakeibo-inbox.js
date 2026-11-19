/* 家計簿暫存匣：發票解析、日幣換算把資料丟進來，家計簿的「暫存」頁籤再補欄位入檔
 * 所有頁面同網域（index.html 用 iframe 載入），共用同一個 localStorage
 * 欄位：{ id, src:'receipt'|'cart', srcId, createdAt, date:'M/D', name, jpy, lines?, cat, pay, kid, en }
 */
(function () {
  const KEY = 'kakeibo_inbox_v1';
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save(list) {
    localStorage.setItem(KEY, JSON.stringify(list));
  }
  // 這個來源（srcId）目前是否還在暫存裡
  function has(srcId) {
    return !!srcId && load().some(e => e.srcId === srcId);
  }
  // 預設同一來源只進一次；force=true 時允許重複送（呼叫端先跟使用者確認）
  function push(entry, force) {
    const list = load();
    if (!force && has(entry.srcId)) return false;
    list.unshift(Object.assign({
      id: 'ib' + Date.now() + Math.random().toString(36).slice(2, 6),
      createdAt: Date.now(),
      cat: '', pay: '', kid: 0, en: 0,
    }, entry));
    save(list);
    return true;
  }
  window.KakeiboInbox = { KEY, load, save, push, has };
})();
