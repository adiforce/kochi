# 日本工具箱 SPEC（旅遊用 PWA 範本）

> 依 2026 高知行（adiforce/kochi）整理。下次換目的地，把這份丟給 Claude，照「§7 新旅程開站步驟」做就好。
> 主題人物、配色都集中在 §3，換掉那邊即可。

---

## 1. 這是什麼

手機用的旅遊工具箱，GitHub Pages 靜態托管、可加入主畫面當 App、離線可開。
一個外殼頁（`index.html`）用 iframe 切換各工具頁，所有頁面同網域、共用 `localStorage`。

- 純 HTML / CSS / 原生 JS，不用框架、不用 build
- 每頁單一檔案（CSS、JS 寫在同檔），共用的只有 `theme.js`（新增，見 §3）、`ryoma-guide.js`→改名 `guide.js`、`doodle-icons.js`、`kakeibo-inbox.js`
- 目標裝置：iPhone Safari 直式；`viewport` 禁止縮放；處理 `safe-area-inset-bottom`

## 2. 檔案結構

```
/
├─ index.html              外殼：Header、進行中行程列、iframe 區、底部 Tab、更多選單、iOS 加入主畫面提示
├─ theme.js                ★主題設定（人物 SVG、色票、站名、旅程日期）— 換主題只改這支
├─ guide.js                浮動導覽角色（原 ryoma-guide.js），各頁說明文字 TIPS
├─ doodle-icons.js         emoji → 蠟筆風 SVG 自動替換
├─ kakeibo-inbox.js        記帳暫存匣（跨頁共用 localStorage）
├─ sw.js                   Service Worker（離線快取）
├─ manifest.webmanifest    PWA 設定
├─ venues.json             地點資料（行程表、地點清單共用）
├─ weather.json            天氣預報（GitHub Action 每 3 小時更新）
├─ travel-plan.html        行程表（核心）
├─ travel-list.html        地點清單＋地圖
├─ travel-checklist.html   行李確認清單＋天氣穿搭
├─ hotel-info.html         訂房記錄
├─ jpyrate.html            日幣換算＆購物車
├─ kakeibo2.html           家計簿（Google Sheet 後端）
├─ receipt.html            發票解析（Claude API）
├─ product-check.html      商品查價（Claude API）
├─ coupon.html             優惠券
├─ creditcard.html         刷卡／支付攻略
├─ icon.svg / icon-192.png / icon-512.png / apple-touch-icon.png / favicon.ico / favicon-32.png
├─ .github/workflows/weather.yml
├─ .github/scripts/fetch_weather.py
└─ netlify/functions/anthropic-proxy.js   （備用，目前頁面直連 API）
```

> 不列入範本：`kakeibo.html`（舊版記帳）、`anime-events.html`（仙台那趟的）。

## 3. 主題設定（人物／配色）

### 3.1 現況問題
色碼散在每頁 `:root`，變數名還是舊的粉紅主題（`--pink-dark` 實際是藍）；人物 SVG 寫死在 `ryoma-guide.js`、行程插圖內。新站要先抽出來。

### 3.2 `theme.js` 規格
每頁 `<head>` 第一個載入，負責：(1) 注入 CSS 變數 (2) 注入人物 SVG sprite (3) 提供旅程常數。

```js
window.THEME = {
  trip: {
    title: '日本工具箱',            // Header、manifest name
    city: '高知',
    start: '2026-11-28', end: '2026-12-02',
    tz: 'Asia/Tokyo',
    hotelName: '東横INN高知',  // 回飯店按鈕實際是抓 venues.json 裡 type:'hotel' 的座標
  },
  colors: {
    primary:      '#2f6fb3',  // Header、active tab、按鈕（原 --pink-dark）
    primaryLight: '#c9dcf0',  // 邊框、tag 底、分隔線（原 --pink）
    bg:           '#f3f5f8',  // 頁面底（原 --cream）
    shellBg:      '#e6ebf1',  // 外殼底、manifest background_color
    text:         '#1f3350',  // 主文字（原 --brown）
    border:       '#d6dee8',
    ink:          '#3b4a63',  // 插圖描邊色
    ok:           '#7bbf6a',
    warn:         '#e8a04d',
  },
  mascot: {
    name: '小龍馬',
    // 必備 symbol：id 固定，換人物只換 SVG 內容
    //  #m-head 頭像（40x40）  #m-wave 揮手全身  #m-point 指路全身
    //  #m-hold 拿當地特產（例：柚子）  #m-bust 半身（浮動導覽用）
    //  viewBox 統一 0 0 40 56（頭 0 0 40 40），描邊 stroke-width 3、color = colors.ink
    sprite: `<svg>...</svg>`,
    fab: 'book',     // 浮動按鈕造型：book（從書冒出）| plain
    walker: true,    // 行程時間軸上照時間走路的小人
  },
};
```

- CSS 一律用新變數名：`--c-primary`、`--c-primary-light`、`--c-bg`、`--c-shell`、`--c-text`、`--c-border`、`--c-ink`、`--c-ok`、`--c-warn`
- 插圖、doodle 圖示的描邊／填色也要吃變數（SVG 內用 `currentColor` 或 `var(--c-ink)`），不寫死 hex
- `manifest.webmanifest` 的 `theme_color` / `background_color` 要手動同步（JSON 不能讀 JS）
- 人物風格：Q 版、大頭、蠟筆濾鏡（`feTurbulence`＋`feDisplacementMap`, baseFrequency 0.045, scale 2~2.4）
- 換人物時注意著作權：歷史人物、原創角色 OK；不要用動漫/品牌角色

### 3.3 導覽角色 `guide.js`
- 每頁右下角浮著角色，點了跳出該頁用法（泡泡、可翻頁）
- 說明文字依檔名寫在 `TIPS`：`{ 'travel-plan': { bottom: 78, tips: [...] } }`，`bottom` 用來避開頁面自己的浮動鈕
- 頁內單句提示：`<div data-rg-hint="說明文字"></div>`
- 插圖可直接 `<use href="#m-wave">`

## 4. 共用元件

| 元件 | 說明 |
|---|---|
| `doodle-icons.js` | `<body>` 後第一行載入；把頁面 emoji 換成同風格 SVG。JS 可呼叫 `doodleIcon('pin')`。現有 key：pin bus car taxi tram station plane takeoff landing canoe sailboat walk passport suitcase backpack castle hotel house store museum temple torii tree park bridge sunrise wave moon tent lantern bag cart teddy books game coat pill dolphin fish shrimp dining ramen sushi sake coffee cake bento meat bacon egg greens warn bulb gem maple alarm clock next finish search… 新地點有特色地標就補一個 |
| `kakeibo-inbox.js` | `KakeiboInbox.push({src, srcId, date:'M/D', name, jpy, lines?})`，同 `srcId` 預設只進一次（`force=true` 才重複）；key `kakeibo_inbox_v1` |
| 字型 | Google Fonts：`Zen Maru Gothic`（標題 700/900）、`Noto Sans TC`（內文 400/700） |

## 5. 各頁規格

### 5.1 `index.html` 外殼
- Header 固定 52px，顯示 `THEME.trip.title`
- **進行中行程列**（36px，Header 下方）：旅程期間才出現。讀 `travel-plan` iframe 的 stop，顯示「進行中／下一站＋站名＋時間」，點了切到行程頁並捲到該站
- iframe 全部預載，切換只改 `display`；最後停留頁存 `localStorage`
- 底部 Tab（62px）5 格：匯率、記帳、發票掃描、查價、⋯更多
- 更多選單（bottom sheet，4 欄 grid）：地點清單、優惠券、卡片優惠、行李確認、行程、飯店資訊
- Tab 配置寫成陣列，方便增減：`[{file, icon, label, main:true|false}]`
- iOS Safari 非 standalone 時顯示「加入主畫面」提示，可關閉（記在 localStorage）
- 註冊 `sw.js`

### 5.2 `travel-plan.html` 行程表（核心）
- 每天一張 `day-card`，左右滑或點插圖 ‹ › 切 Day 1～N，頁碼「1 / 5」
- **Day hero**：320×130 SVG 插圖（當天主景點＋角色），蠟筆濾鏡、元素小動畫（`ha-*` class：drift/twinkle/glow/tram/shimmer/hop/sway/wave/car/fall/plane…）；`prefers-reduced-motion` 時關動畫
- hero 下：一句當日流程（A → B → C）、提醒 chips
- day-head：Day 編號、日期（星期）、天氣（點一下更新）、↺ 重置延誤
- **stop 結構**：
  ```html
  <div class="stop" data-date="2026-11-28" data-start="04:00" data-end="04:30" data-idx="0">
    <div class="stop-time"><span class="stop-time-orig">⏰ 04:00</span><span class="delay-adjusted"></span></div>
    <div class="delay-ctrl"><button class="delay-btn" data-delta="-30">－30</button><span class="delay-count"></span><button class="delay-btn" data-delta="30">＋30</button></div>
    <div class="stop-name">站名</div>
    <div class="stop-note">備註</div>
    <a class="map-link" href="https://www.google.com/maps/search/?api=1&query=店名">📍</a>
  </div>
  ```
- **延誤調整**：每站 ±30 分，後面所有站時間累加往後推；存 `localStorage`（key 依日期＋idx），可整天重置
- **現在位置**：右下「📍現在」跳到進行中／下一站；進行中的站高亮；時間軸上角色依時間比例走向下一站（walker）
- **地點詳情**：`map-link` 的 query 與 `venues.json` 模糊比對（`findVenue`），比到就加「詳細」按鈕 → bottom sheet 顯示評分、營業時間、交通、推薦、附近地點；有座標可開 Leaflet 迷你地圖
- 頂部可折疊 `<details>`：交通班次重點、出發前待查事項
- 天氣：先讀 `weather.json`（各日期對應 point），點擊時直連 Open-Meteo 更新並快取

### 5.3 `travel-list.html` 地點清單
- 讀 `venues.json`；列表／地圖（Leaflet＋OSM 圖磚）切換，記住檢視模式
- 類別篩選（依 `type`）、搜尋
- 「我在這附近」：定位後列出 500m／1km／2km 內地點
- 快捷：顯示全部、市區範圍、回飯店（venues.json 中 `type:'hotel'` 那筆）、我的位置（角色揮手圖示＋藍色光圈）

### 5.4 `travel-checklist.html` 行李確認
- 分組勾選清單（證件錢、電子隨身、藥品衛生、衣物配件、收納出門前），進度 x/y，狀態存 localStorage
- 上方天氣卡：依旅程期間預報算穿搭建議，自動加「依天氣加帶」項目

### 5.5 `hotel-info.html` 訂房記錄
- 航班摘要、每晚一張卡（日期、房型、人數、價格、連住標記）、總計
- ⚠️ 公開站：**不放手機、車牌、會員號等個資**；預約號視情況遮蔽

### 5.6 `jpyrate.html` 日幣換算＆購物車
- 匯率：`currency-api`（jsDelivr / pages.dev 兩個來源備援），快取 `jpy_rate_v1`
- 輸入「税込」價 → 台幣；顯示內含稅額拆解
- 購物車（`jpy_cart_v1`）：品名、數量、單價；勾「已購買」時鎖定當下匯率
- 已購買項可「送記帳暫存」（KakeiboInbox, src:'cart'）

### 5.7 `kakeibo2.html` 家計簿
- 後端：Google Apps Script Web App（`.../exec`），POST `action:'write'`、`action=delete`，GET 讀紀錄；資料存在 Google Sheet
- 前端密碼鎖：未解鎖只能看
- 頁籤：✏️記帳｜📥暫存｜📋紀錄
- 欄位：日期、品項、日圓金額、類別、付款工具、額外分攤、HAO支出／它人支出
- `CATEGORIES`、`PAYMENTS` 陣列在檔頭，**每趟依實際卡片調整**
- 新旅程要：複製 Sheet＋重新部署 GAS，換 URL

### 5.8 `receipt.html` 發票解析 / 5.9 `product-check.html` 商品查價
- 使用者在 ⚙️ 設定貼 Claude API Key，存 localStorage（不進 repo）
- 前端直連 `api.anthropic.com/v1/messages`，header 帶 `anthropic-dangerous-direct-browser-access: true`
- 模型寫在檔內常數（目前 `claude-opus-5-5`），新站開之前確認最新 model id
- 發票：拍照／選圖 → 中日對照明細 → 複製 Excel、送記帳暫存；歷史 `invoice_history_v2`
- 查價：照片 → 商品辨識＋日本/台灣價格比較；歷史 `product_history_v2`

### 5.10 `coupon.html` / 5.11 `creditcard.html`
- 純內容頁；每趟重新整理（優惠券效期、信用卡活動、登錄日期）
- coupon 依類別 tab 篩選（藥妝／電器／百貨／雜貨／運動／機場），退稅免手續費用綠框標示
- creditcard 依情境（一般刷卡、交通、超商…）列首選／次推，標註更新日期

## 6. 資料格式

### 6.1 `venues.json`（陣列）
```json
{
  "name": "顯示名（中文/英文）",
  "jp": "日文名",
  "type": "food | shop | sight | spot | teacake | hotel | rentacar",
  "cat": "細分類文字",
  "img": "",
  "gRating": null, "gReviews": null,
  "tRating": null, "tReviews": null,
  "lat": 33.0, "lng": 133.0,
  "price": "價位文字",
  "hours": "營業時間文字",
  "addr": "完整地址",
  "mapAddr": "給地圖搜尋用的地址",
  "access": "交通方式",
  "rec": [],
  "notes": "備註；查不到的評分說明原因",
  "wasFilled": false
}
```
- 查不到的值填 `null`，不要編；座標是概略的就在 notes 註明
- `img` 留空，由使用者自己貼

### 6.2 `weather.json`
- `fetch_weather.py` 產生，`POINTS` 字典：`default`＝主城市，另可用日期當 key 指定當天去的地區（例：`"2026-11-30": 仁淀川`）
- 結構：`{ source, updated, points: { key: { name, daily: { time[], weather_code[], temperature_2m_max[], temperature_2m_min[], precipitation_probability_max[] } } } }`
- Open-Meteo，`forecast_days=16`，`timezone=Asia/Tokyo`；抓失敗就保留舊檔

### 6.3 localStorage key 一覽
| key | 用途 |
|---|---|
| `kakeibo_inbox_v1` | 記帳暫存 |
| `jpy_cart_v1` / `jpy_rate_v1` | 購物車／匯率快取 |
| `invoice_history_v2` / `product_history_v2` | AI 解析歷史 |
| `product-claude-key` | API Key |
| `travel-checklist-state` | 行李勾選 |
| `kochiListView` | 清單檢視模式 → 新站改成 `listView` |
| 延誤 key（依日期＋idx） | 行程延誤 |
| `japan-toolbox-a2hs-dismissed` | 加入主畫面提示已關 |

> 新站建議所有 key 加前綴（例：`trip_` 或城市名），避免同網域多站互相干擾。

## 7. 外部服務

| 服務 | 用在 | 備註 |
|---|---|---|
| GitHub Pages | 托管 | main 分支根目錄 |
| GitHub Actions | 天氣 | cron `17 */3 * * *`，`permissions: contents: write`，有變動才 commit |
| Open-Meteo | 天氣 | 免 key，CC BY 4.0 要標來源 |
| currency-api（jsDelivr / pages.dev） | 匯率 | 免 key |
| Google Apps Script | 記帳 | 每趟一個 Sheet |
| Anthropic API | 發票、查價 | 使用者自備 key |
| Leaflet + OSM tiles | 地圖 | 圖磚由 SW 快取 |

## 8. Service Worker（`sw.js`）
- `VERSION` 改任何檔案就 +1（例 `v26` → `v27`）
- `CORE_FILES`：所有頁面＋共用 JS＋json＋icon，安裝時整包快取
- 同站 HTML/JSON：網路優先，4 秒沒回就用快取
- 字型、圖片：runtime cache（上限 200）；OSM 圖磚：`osm-tiles`（上限 600）
- `BYPASS_HOSTS` 不快取：script.google.com、googleusercontent、api.anthropic.com、cdn.jsdelivr.net、currency-api.pages.dev、open-meteo
- 新增頁面記得加進 `CORE_FILES`

## 9. 新旅程開站步驟

1. 開新 repo，複製本站（排除 `kakeibo.html`、`anime-events.html`、`netlify/`）
2. 改 `theme.js`：trip（名稱、城市、日期、飯店名）、colors、mascot（新人物 SVG 5 個 symbol）
3. 同步 `manifest.webmanifest`（name、description、theme_color、background_color）；重畫 icon
4. `guide.js` 的 `TIPS` 換說明口吻（角色名）
5. `fetch_weather.py` 的 `POINTS` 改新城市座標；手動跑一次 workflow
6. `venues.json` 清空，依行程逐筆補
7. `travel-plan.html`：每天的 hero 插圖、流程句、chips、stops
8. `hotel-info.html`：航班、訂房（不放個資）
9. 記帳：複製 Google Sheet → 部署新 GAS → 換 `kakeibo2.html` 裡的 URL；調整 `PAYMENTS`
10. `coupon.html`、`creditcard.html` 內容更新
11. `doodle-icons.js` 補新地點特色圖示
12. localStorage key 換前綴
13. `sw.js` 的 `CORE_FILES` 核對、`VERSION` 重設
14. GitHub Pages 開啟 → 手機加入主畫面測：離線開啟、行程延誤、現在位置、地圖定位、記帳寫入
