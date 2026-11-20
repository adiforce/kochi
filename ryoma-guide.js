/* 小龍馬導覽：每頁右下角浮著一隻 Q 版坂本龍馬，點他會講這頁的用法
 * - 頁面只要 <script src="ryoma-guide.js"></script>，說明文字依檔名寫在 TIPS 裡
 * - 想在頁面某處放一句說明：<div data-rg-hint="說明文字"></div>
 * - 也提供 <use href="#rm-wave|#rm-point|#rm-head"> 給插圖用（行程表）
 */
(function () {
  if (window.RyomaGuide) return;

  const TIPS = {
    'travel-plan': {
      bottom: 78,
      tips: [
        '左右滑動（或點插圖兩側的 ‹ ›）可以切換 Day 1～Day 5。',
        '行程延誤了？按該站的「＋30／－30」，後面的時間會一起往後推；當天全部重來就按「↺ 重置延誤」。',
        '右下角「📍現在」會直接跳到正在進行或下一個行程；時間軸左邊小小的我，會照時間慢慢走向下一站。',
        '點「🌤️ 點我查天氣」看當天預報；站點右邊有 📍 的，點一下會開 Google Maps。',
      ],
    },
    'kakeibo2': {
      tips: [
        '右上角 🔒 輸入密碼解鎖後才能記帳和刪除；沒解鎖只能看。',
        '「✏️ 記帳」直接輸入日期、品項、日圓金額，選類別和付款工具就能送出。',
        '發票解析、日幣換算送過來的會先進「📥 暫存」，點一筆、補類別和付款工具再按「入檔」。',
        '「📋 紀錄」可以看已經記好的帳，也能刪除打錯的那筆。',
      ],
    },
    'receipt': {
      tips: [
        '第一次用先到「⚙️ 設定」貼上 Claude API Key 並保存。',
        '「📷 拍照」或「🖼 選圖」放入發票，再按「解析」，就會變成中日對照的明細。',
        '解析完按「📥 送記帳暫存」，整張會變成一筆送到家計簿的暫存，再去那邊補類別入檔。',
        '「📋 複製 Excel」可以把明細貼到試算表。',
      ],
    },
    'jpyrate': {
      tips: [
        '輸入標價上的「税込」含稅日幣，馬上換算成台幣。',
        '按「🛍️ 加入購物車」記下想買的東西，合計會用即時匯率算。',
        '買了就勾「已購買」，匯率會鎖在當下，不會再跟著變動。',
        '已購買的商品下面有「📥 送記帳暫存」，送過去後到家計簿的暫存頁補類別就能入檔。',
      ],
    },
    'product-check': {
      tips: [
        '第一次用先到「⚙️ 設定」貼上 Claude API Key 並保存。',
        '拍下商品或包裝，按「🔍 分析」，會幫你查日本和台灣的價格差。',
        '台灣比較便宜的就不用扛回去了～',
      ],
    },
    'coupon': {
      tips: [
        '上面的分類可以只看藥妝、電器、百貨等店家。',
        '結帳時出示手機畫面＋護照給店員，就能用優惠。',
        '綠框的店家退稅不收手續費；特價品、食品常不適用，現場再確認。',
      ],
    },
    'creditcard': {
      tips: [
        '「🎯 依情境用哪張」照場合挑卡：一般商店、餐廳、超商、指定店、PayPay 各有首選。',
        '每月要登錄的加碼記得先登錄，額度吃滿再換下一張。',
        '高知的電車和公車不收 Suica，交通卡加碼這趟幫助不大。',
      ],
    },
    'travel-list': {
      tips: [
        '這裡是 Google Maps 共享清單的地點；點名稱就能複製（給計程車司機或店員看很方便）。',
        '「▼ 展開」看詳細介紹，也能查 1 公里內的附近景點。',
        '按「📍 我在這附近」，再選 500m／1km／2km，找出身邊可以順路去的地方。',
      ],
    },
    'travel-checklist': {
      tips: [
        '出發前一項一項打勾，上面會顯示完成幾項。',
        '「🌡️ 高知天氣 × 穿搭建議」會依預報提醒要多帶什麼，按「↻ 更新」重抓天氣。',
      ],
    },
    'hotel-info': {
      tips: [
        '4 晚都訂在東橫INN高知，現場付款。',
        '15:00～16:00 入住，Day 1 中午先寄放行李；Check-in 記得帶會員卡。',
      ],
    },
    'anime-events': {
      tips: [
        '上面的分類可以只看特定作品的活動。',
        '🔥 是行程期間內有開的；出發前再到官方頁面確認檔期。',
      ],
    },
  };

  const NS = 'http://www.w3.org/2000/svg';
  const HEAD = '<g id="rm-headg"><path d="M24 8.5c3-4.5 7.5-4.5 8.5-1.2-2 1-4 1.2-6 2.2" fill="#3b4a63"/><circle cx="20" cy="22" r="13" fill="#ffe3c8"/><path d="M7.2 23c-1.4-9.5 4.6-16 12.8-16s14.2 6.5 12.8 16c-1.8-1.8-3-4.6-3.2-7.4-2.2 2-5 2.8-8 2.2 1-1.8 1.2-3.4.4-5.2-3 3.4-7.6 4.6-12 3.8.2 2.2-.6 4.4-2.8 6.6z" fill="#3b4a63"/><circle cx="16" cy="24.5" r="1.5" fill="#3b4a63" stroke="none"/><circle cx="24" cy="24.5" r="1.5" fill="#3b4a63" stroke="none"/><path d="M17.6 28.6q2.4 2 4.8 0" fill="none"/><ellipse cx="12.6" cy="27.8" rx="2.2" ry="1.3" fill="#f6b8c4" stroke="none"/><ellipse cx="27.4" cy="27.8" rx="2.2" ry="1.3" fill="#f6b8c4" stroke="none"/></g>';
  // 身體從頭的後面長出來（先畫身體再畫頭），避免頭身分離
  // 上半身和服＋腰帶＋下半身袴（中間一道褶），避免看起來像攤開的書
  const BODY = '<path d="M9.5 46c.4-6 1-10.5 3.2-12.6 2-1.4 4.6-1.9 7.3-1.9s5.3.5 7.3 1.9c2.2 2.1 2.8 6.6 3.2 12.6z" fill="#4a5a7a"/>'
    + '<path d="M9.3 45.5l-1.6 10h24.6l-1.6-10z" fill="#8f9bb0"/><path d="M20 47.5v8" fill="none" stroke-width="2"/>'
    + '<path d="M9.4 43.2h21.2v3.4H9.4z" fill="#d9b26a" stroke-width="2.2"/>'
    + '<path d="M16.8 34.2l3.2 5.6 3.2-5.6" fill="none" stroke-width="2.2"/>';
  const ARM_WAVE = '<path d="M29.5 42l6-10" fill="none"/><circle cx="36" cy="31" r="2.8" fill="#ffe3c8" stroke-width="2"/>';
  // 浮動導覽用：舉著一顆柚子
  const ARM_YUZU = '<path d="M29.5 41l6-8" fill="none"/><circle cx="40.5" cy="26.5" r="6.4" fill="#ffd23f" stroke-width="2.2"/><path d="M40.5 20.4c1.4-2.6 3.8-3.4 6-2.8-1 2.4-3.4 3.4-6 2.8z" fill="#8cc63f" stroke-width="1.6"/><circle cx="38.3" cy="24.8" r="1.1" fill="#fff6c2" stroke="none"/><circle cx="36.4" cy="32" r="2.8" fill="#ffe3c8" stroke-width="2"/>';
  const ARM_POINT = '<path d="M10.5 42l-6-11" fill="none"/><circle cx="4.2" cy="30" r="2.8" fill="#ffe3c8" stroke-width="2"/>';
  const SPRITE = '<svg xmlns="' + NS + '" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs>'
    + '<filter id="rg-crayon" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/></filter>'
    + HEAD
    + '<symbol id="rm-wave" viewBox="0 0 40 56" overflow="visible"><g stroke-width="3">' + BODY + ARM_WAVE + '<use href="#rm-headg"/></g></symbol>'
    + '<symbol id="rm-point" viewBox="0 0 40 56" overflow="visible"><g stroke-width="3">' + BODY + ARM_POINT + '<use href="#rm-headg"/></g></symbol>'
    + '<symbol id="rm-yuzu" viewBox="0 0 40 56" overflow="visible"><g stroke-width="3">' + BODY + ARM_YUZU + '<use href="#rm-headg"/></g></symbol>'
    + '<symbol id="rm-yuzu-bust" viewBox="0 0 40 56" overflow="visible"><g stroke-width="3"><path d="M9.2 54c.2-9 .9-16.4 3.5-20.6 2-1.4 4.6-1.9 7.3-1.9s5.3.5 7.3 1.9c2.6 4.2 3.3 11.6 3.5 20.6z" fill="#4a5a7a"/><path d="M16.8 34.2l3.2 5.6 3.2-5.6" fill="none" stroke-width="2.2"/>' + ARM_YUZU + '<use href="#rm-headg"/></g></symbol>'
    + '<symbol id="rm-head" viewBox="0 0 40 40" overflow="visible"><g stroke-width="3"><use href="#rm-headg"/></g></symbol>'
    + '</defs></svg>';

  // 右下角導覽：龍馬從一本攤開的大書裡冒出來（書固定，龍馬上下飄）
  const BOOK_FAB = '<svg class="rg-body" viewBox="4 24 58 48" aria-hidden="true" focusable="false"><g filter="url(#rg-crayon)" stroke="#3b4a63" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M9 34l1.3-2.8 1.3 2.8-1.3 2.8zM55 30l1.1-2.4 1.1 2.4-1.1 2.4zM57 44l.9-1.9.9 1.9-.9 1.9z" fill="#ffd977" stroke-width="1.2"/>'
    + '<g class="rg-rise"><use href="#rm-yuzu-bust" x="17" y="24" width="31" height="43.4"/></g>'
    // 封面（左右露出一點邊）
    + '<path d="M10.5 59.5c7.5-3 15-3 22.5 1.2 7.5-4.2 15-4.2 22.5-1.2v8.3c-7.5-2.8-15-2.8-22.5 1.4-7.5-4.2-15-4.2-22.5-1.4z" fill="#2f6fb3"/>'
    // 書頁厚度
    + '<path d="M12.5 58.2c6.8-2.6 13.6-2.4 20.5 1.4v7.2c-6.9-3.6-13.7-3.8-20.5-1.4zM53.5 58.2c-6.8-2.6-13.6-2.4-20.5 1.4v7.2c6.9-3.6 13.7-3.8 20.5-1.4z" fill="#f3ead6" stroke-width="1.4"/>'
    // 最上面那頁，從外側往書脊彎下去
    + '<path d="M12.5 57.4c4-3.6 13-4.4 20.5.2v6c-6.9-3.4-14-3.4-20.5-.6zM53.5 57.4c-4-3.6-13-4.4-20.5.2v6c6.9-3.4 14-3.4 20.5-.6z" fill="#fffdf6" stroke-width="1.5"/>'
    + '<path d="M16 58.6c4-1.4 8.5-1.4 13 .4M16 61c4-1.4 8.5-1.4 13 .4M37 59c4.5-1.8 9-1.8 13-.4M37 61.4c4.5-1.8 9-1.8 13-.4" fill="none" stroke="#b9c2cf" stroke-width="1"/>'
    + '<path d="M33 57.6v11.2" fill="none" stroke-width="1.5"/>'
    + '</g></svg>';
  function art(sym, cls) {
    return '<svg class="' + cls + '" viewBox="0 0 40 56" aria-hidden="true" focusable="false"><g filter="url(#rg-crayon)" stroke="#3b4a63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><use href="#' + sym + '"/></g></svg>';
  }

  const CSS = `
  .rg-fab{position:fixed;right:8px;bottom:calc(var(--rg-bottom,14px) + env(safe-area-inset-bottom));z-index:60;width:58px;height:48px;padding:0;border:none;background:none;cursor:pointer;-webkit-tap-highlight-color:transparent;}
  .rg-fab .rg-body{width:58px;height:48px;overflow:visible;filter:drop-shadow(0 3px 3px rgba(59,74,99,.18));}
  .rg-fab .rg-rise{animation:rg-rise 2.8s ease-in-out infinite;}
  @keyframes rg-rise{0%,100%{transform:translateY(1px);}50%{transform:translateY(-5px);}}
  .rg-pop{position:fixed;right:12px;bottom:calc(var(--rg-bottom,14px) + 58px + env(safe-area-inset-bottom));z-index:61;width:min(260px,calc(100vw - 24px));padding:10px 12px 8px;border:2px solid #3b4a63;border-radius:14px 14px 4px 14px;background:#fff6e0;color:#3b4a63;font-size:13px;line-height:1.65;box-shadow:0 6px 18px rgba(59,74,99,.18);opacity:0;transform:translateY(6px) scale(.97);transform-origin:100% 100%;pointer-events:none;transition:opacity .18s,transform .18s;}
  .rg-pop.show{opacity:1;transform:none;pointer-events:auto;}
  .rg-pop::after{content:'';position:absolute;right:22px;bottom:-9px;width:14px;height:14px;background:#fff6e0;border-right:2px solid #3b4a63;border-bottom:2px solid #3b4a63;transform:rotate(45deg);}
  .rg-who{font-size:11px;font-weight:700;opacity:.55;margin-bottom:2px;}
  .rg-foot{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:11.5px;}
  .rg-count{flex:1;opacity:.5;}
  .rg-foot button{border:1.5px solid #3b4a63;border-radius:999px;background:#fff;color:#3b4a63;font:inherit;font-weight:700;padding:1px 10px;cursor:pointer;}
  .rg-foot .rg-close{border:none;background:none;padding:0 2px;font-size:14px;opacity:.6;}
  .rg-spacer{height:84px;}
  .rg-hint{display:flex;align-items:flex-end;gap:6px;margin:6px 0 8px;}
  .rg-hint .rg-mini{width:30px;height:42px;flex-shrink:0;overflow:visible;animation:rg-float 2.8s ease-in-out infinite;}
  .rg-hint .rg-say{position:relative;flex:1;margin-bottom:14px;padding:6px 10px;border:1.5px solid #3b4a63;border-radius:12px 12px 12px 3px;background:#fff6e0;color:#3b4a63;font-size:12px;line-height:1.6;}
  @keyframes rg-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
  @media (prefers-reduced-motion:reduce){.rg-fab .rg-rise,.rg-hint .rg-mini{animation:none;}}
  @media print{.rg-fab,.rg-pop{display:none;}}
  `;

  function page() {
    const f = (location.pathname.split('/').pop() || 'index.html').replace(/\.html?$/, '');
    return f || 'index';
  }

  function installSprite() {
    if (document.getElementById('rm-headg')) return;
    const holder = document.createElement('div');
    holder.innerHTML = SPRITE;
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    document.body.prepend(holder);
    const st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function renderHints(root) {
    (root || document).querySelectorAll('[data-rg-hint]:not(.rg-hint)').forEach(el => {
      el.classList.add('rg-hint');
      const say = document.createElement('div');
      say.className = 'rg-say';
      say.textContent = el.getAttribute('data-rg-hint');
      el.innerHTML = art('rm-point', 'rg-mini');
      el.appendChild(say);
    });
  }

  function installFab(cfg) {
    if (!cfg || !cfg.tips || !cfg.tips.length) return;
    const key = 'ryoma_guide_seen_' + page();
    document.documentElement.style.setProperty('--rg-bottom', (cfg.bottom || 14) + 'px');
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'rg-fab';
    fab.setAttribute('aria-label', '小龍馬說明這頁怎麼用');
    fab.innerHTML = BOOK_FAB;
    const pop = document.createElement('div');
    pop.className = 'rg-pop';
    pop.setAttribute('role', 'dialog');
    pop.innerHTML = '<div class="rg-who">龍馬的小提示</div><div class="rg-text"></div><div class="rg-foot"><span class="rg-count"></span><button type="button" class="rg-next">下一則 ›</button><button type="button" class="rg-close" aria-label="關閉">✕</button></div>';
    document.body.appendChild(pop);
    document.body.appendChild(fab);
    const spacer = document.createElement('div');
    spacer.className = 'rg-spacer';
    document.body.appendChild(spacer);

    let i = 0;
    const text = pop.querySelector('.rg-text');
    const count = pop.querySelector('.rg-count');
    const next = pop.querySelector('.rg-next');
    function show(n) {
      i = (n + cfg.tips.length) % cfg.tips.length;
      text.textContent = cfg.tips[i];
      count.textContent = (i + 1) + ' / ' + cfg.tips.length;
      next.textContent = i === cfg.tips.length - 1 ? '從頭 ↺' : '下一則 ›';
      next.style.display = cfg.tips.length > 1 ? '' : 'none';
      pop.classList.add('show');
    }
    function hide() {
      pop.classList.remove('show');
      try { localStorage.setItem(key, '1'); } catch (e) {}
    }
    fab.addEventListener('click', () => pop.classList.contains('show') ? show(i + 1) : show(i));
    next.addEventListener('click', () => show(i + 1));
    pop.querySelector('.rg-close').addEventListener('click', hide);
    let seen = false;
    try { seen = localStorage.getItem(key) === '1'; } catch (e) {}
    if (!seen) setTimeout(() => show(0), 1200);
  }

  function init() {
    installSprite();
    renderHints();
    installFab(TIPS[page()]);
  }

  window.RyomaGuide = { art, renderHints, TIPS };
  // 等整頁解析完才找 data-rg-hint
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
