/* 手繪風小圖示：把頁面上的 emoji 自動換成同一套蠟筆風 SVG
 * 用法：<body> 之後第一行放 <script src="doodle-icons.js"></script>
 * JS 裡要直接產圖示可用 doodleIcon('pin')
 */
(function(){
  const CLOUD = 'M7 19a4 4 0 0 1-.6-8 5.5 5.5 0 0 1 10.6-1.6A4.8 4.8 0 0 1 17.5 19z';
  const SUN = '<path d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/><circle cx="12" cy="12" r="5" fill="#ffd977"/>';
  const PLANE = '<path d="M3.5 13.2c.8-1.9 3-2.7 6-2.7h7.2c2.6 0 4 .9 4.6 2.2-.6 1.3-2 2.1-4.6 2.1H8.2c-2.3 0-3.9-.6-4.7-1.6z" fill="#fff"/><path d="M5 11.2L3.6 7.4h1.8l3 3.3" fill="#f6b8c4"/><path d="M12 14.8l-3 4.7h1.9l4.9-4.7" fill="#c9dcf0"/><path d="M12 10.5l-2.4-3.6h1.7l3.6 3.6" fill="#c9dcf0"/><circle cx="12.5" cy="12.4" r=".7" fill="#9cc7ea" stroke="none"/><circle cx="14.7" cy="12.4" r=".7" fill="#9cc7ea" stroke="none"/><circle cx="16.9" cy="12.4" r=".7" fill="#9cc7ea" stroke="none"/>';
  const CAR = (c) => `<path d="M3 16v-2.5c0-1.4.9-2.2 2.3-2.2h1.4l2.4-3.2c.4-.5.9-.8 1.6-.8h4.4c.7 0 1.2.3 1.6.8l2.2 3.2h.8c1.4 0 2.3.8 2.3 2.2V16z" fill="${c}"/><path d="M9.6 11.3l1.6-2.2h1.7v2.2zM14.6 9.1h1.4l1.5 2.2h-2.9z" fill="#c9dcf0" stroke-width="1.1"/><circle cx="7.5" cy="16.5" r="2" fill="#3b4a63"/><circle cx="16.5" cy="16.5" r="2" fill="#3b4a63"/>`;
  const FOOT = '<path d="M7.2 13.5c-1.7-.2-2.6-2.5-2.4-4.8.2-2.2 1.3-3.6 2.7-3.4 1.4.2 2 1.9 1.8 4.1-.2 2.4-.6 4.3-2.1 4.1z" fill="#f2a65a"/><path d="M5.5 15.4c.1 1.3 1 2.2 2.1 2.1 1-.1 1.6-1 1.5-2.3z" fill="#f2a65a"/>';
  const RAIN = '<path d="M8 17.5l-1.2 3M12 17.5l-1.2 3M16 17.5l-1.2 3" stroke="#5b9bd5" stroke-width="1.8"/>';
  const SNOW = '<circle cx="8" cy="19" r="1.1" fill="#fff"/><circle cx="12" cy="21" r="1.1" fill="#fff"/><circle cx="16" cy="19" r="1.1" fill="#fff"/>';

  const I = {
    pin: '<path d="M12 21.5c-4-4.6-6.5-8.1-6.5-11.2a6.5 6.5 0 0 1 13 0c0 3.1-2.5 6.6-6.5 11.2z" fill="#e06a4e"/><circle cx="12" cy="10.2" r="2.4" fill="#fff6e0"/>',
    bus: '<rect x="4" y="4" width="16" height="14" rx="3" fill="#ffd977"/><rect x="6.5" y="6.5" width="11" height="5" rx="1" fill="#c9dcf0"/><path d="M4 14h16"/><circle cx="8" cy="19" r="1.8" fill="#3b4a63"/><circle cx="16" cy="19" r="1.8" fill="#3b4a63"/><circle cx="7.2" cy="16" r=".8" fill="#fff" stroke="none"/><circle cx="16.8" cy="16" r=".8" fill="#fff" stroke="none"/>',
    car: CAR('#e06a4e'),
    taxi: CAR('#ffd977') + '<rect x="11" y="4.6" width="3.2" height="2.2" rx=".6" fill="#fff6e0" stroke-width="1.2"/>',
    tram: '<path d="M10 4.5l2-2.3 2 2.3" stroke-width="1.3"/><rect x="5" y="4.5" width="14" height="14" rx="3.5" fill="#fff6e0"/><path d="M5 13h14v2c0 1.9-1.6 3.5-3.5 3.5h-7A3.5 3.5 0 0 1 5 15z" fill="#7bbf6a"/><rect x="7.3" y="7" width="9.4" height="4.2" rx="1" fill="#c9dcf0"/><circle cx="8.3" cy="15.6" r=".9" fill="#ffd977" stroke="none"/><circle cx="15.7" cy="15.6" r=".9" fill="#ffd977" stroke="none"/><path d="M7.5 18.5l-1.5 3M16.5 18.5l1.5 3"/>',
    station: '<rect x="5" y="3" width="14" height="14" rx="3.5" fill="#fff"/><path d="M5 11.5h14V13.5c0 1.9-1.6 3.5-3.5 3.5h-7A3.5 3.5 0 0 1 5 13.5z" fill="#9cc7ea"/><rect x="7.3" y="5.5" width="9.4" height="4" rx="1" fill="#c9dcf0"/><circle cx="8.3" cy="14.2" r=".9" fill="#ffd977" stroke="none"/><circle cx="15.7" cy="14.2" r=".9" fill="#ffd977" stroke="none"/><path d="M8 17l-2 3M16 17l2 3M3 21h18"/>',
    plane: PLANE,
    takeoff: `<g transform="rotate(-22 12 12)">${PLANE}</g><path d="M3 21h9"/>`,
    landing: `<g transform="rotate(18 12 12)">${PLANE}</g><path d="M12 21.2h9"/>`,
    canoe: '<path d="M15 4.5l-6 13" /><path d="M8.2 19.6l1.6-3.2 1.7.8-1.4 3z" fill="#f2a65a"/><path d="M2.5 14.5h19c-1.2 3-4 4.5-7.5 4.5h-4c-3.5 0-6.3-1.5-7.5-4.5z" fill="#c0704f"/><path d="M6 16.5h12" stroke-width="1.1"/>',
    sailboat: '<path d="M12 3v12"/><path d="M12 4l6.5 10H12z" fill="#fff"/><path d="M11 6.5L6 14h5z" fill="#f6b8c4"/><path d="M3.5 15.5h17L18 19H6z" fill="#e06a4e"/><path d="M2 21.5q2.5-1.5 5 0t5 0 5 0 5 0" stroke="#5b9bd5"/>',
    walk: FOOT + `<g transform="translate(8.5 2)">${FOOT}</g>`,
    passport: '<rect x="6" y="3" width="12" height="18" rx="2" fill="#5a6b85"/><circle cx="12" cy="10" r="3" stroke="#ffd977" stroke-width="1.2"/><path d="M9 10h6M12 7c-1 1-1 5 0 6M12 7c1 1 1 5 0 6" stroke="#ffd977" stroke-width="1"/><path d="M9 16.5h6" stroke="#ffd977" stroke-width="1.2"/>',
    suitcase: '<path d="M9 7V5.2c0-.7.5-1.2 1.2-1.2h3.6c.7 0 1.2.5 1.2 1.2V7"/><rect x="4" y="7" width="16" height="12.5" rx="2.5" fill="#f2a65a"/><path d="M8 7v12.5M16 7v12.5" stroke-width="1.3"/><circle cx="7.5" cy="20.8" r="1" fill="#3b4a63"/><circle cx="16.5" cy="20.8" r="1" fill="#3b4a63"/>',
    backpack: '<path d="M9 5.5v-1a3 3 0 0 1 6 0v1"/><path d="M5.5 10a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2z" fill="#7bbf6a"/><rect x="8" y="13.5" width="8" height="5" rx="1.5" fill="#a8d59a"/><path d="M8 11h8" stroke-width="1.2"/>',
    castle: '<path d="M4.5 21l1.8-6.5h11.4l1.8 6.5z" fill="#ddd6cb"/><rect x="7.5" y="11" width="9" height="3.5" fill="#fff"/><rect x="9.3" y="7" width="5.4" height="3" fill="#fff"/><path d="M5 11.5q2.5 0 4-2.5h6q1.5 2.5 4 2.5z" fill="#5a6b85"/><path d="M8 7.5q1.8 0 2.6-2.3h2.8q.8 2.3 2.6 2.3z" fill="#5a6b85"/><circle cx="10.6" cy="4.2" r=".8" fill="#ffd977" stroke-width="1"/><circle cx="13.4" cy="4.2" r=".8" fill="#ffd977" stroke-width="1"/><rect x="11" y="16.5" width="2" height="2" fill="#3b4a63" stroke="none"/>',
    hotel: '<path d="M3 21h18"/><rect x="5" y="5" width="14" height="16" rx="1.5" fill="#c9dcf0"/><g fill="#fff" stroke-width="1.1"><rect x="7.5" y="8" width="2.5" height="2.5"/><rect x="14" y="8" width="2.5" height="2.5"/><rect x="7.5" y="12.5" width="2.5" height="2.5"/><rect x="14" y="12.5" width="2.5" height="2.5"/></g><rect x="10.3" y="16.5" width="3.4" height="4.5" fill="#f2a65a" stroke-width="1.2"/><circle cx="12" cy="4.6" r="2.7" fill="#e06a4e"/><path d="M11 3.4v2.4M13 3.4v2.4M11 4.6h2" stroke="#fff" stroke-width="1"/>',
    house: '<path d="M6 10.5v10h12v-10L12 5.3z" fill="#fff6e0"/><path d="M3.5 11.8L12 4.3l8.5 7.5" stroke="#e06a4e" stroke-width="2.2"/><rect x="10.2" y="14.5" width="3.6" height="6" fill="#f2a65a" stroke-width="1.2"/>',
    store: '<rect x="4" y="6" width="16" height="15" rx="1" fill="#f6b8c4"/><path d="M3 6h18l-1.5-3h-15z" fill="#e06a4e"/><path d="M4 11h16M4 16h16" stroke-width="1.1"/><rect x="10" y="17" width="4" height="4" fill="#fff" stroke-width="1.1"/>',
    museum: '<path d="M3 9l9-5 9 5z" fill="#fff6e0"/><path d="M6 10.5V18M10 10.5V18M14 10.5V18M18 10.5V18" stroke-width="1.8"/><rect x="3.5" y="18" width="17" height="3" rx=".5" fill="#ddd6cb"/>',
    temple: '<path d="M12 7.5V4.5"/><rect x="6" y="11" width="12" height="8" fill="#e06a4e"/><path d="M2.5 11q4.5 0 6-3.5h7q1.5 3.5 6 3.5z" fill="#5a6b85"/><rect x="10" y="13.5" width="4" height="5.5" fill="#fff6e0" stroke-width="1.1"/><path d="M4 19.8h16" stroke-width="2"/>',
    torii: '<rect x="6.2" y="7" width="2" height="14" fill="#e06a4e"/><rect x="15.8" y="7" width="2" height="14" fill="#e06a4e"/><rect x="4.5" y="9" width="15" height="1.8" fill="#e06a4e"/><path d="M2.5 5.2q9.5-2.6 19 0v2q-9.5-2.4-19 0z" fill="#e06a4e"/>',
    tree: '<path d="M12 21v-7" stroke-width="2"/><circle cx="8.5" cy="12" r="4" fill="#7bbf6a"/><circle cx="15.5" cy="12" r="4" fill="#7bbf6a"/><circle cx="12" cy="8" r="5" fill="#a8d59a"/>',
    park: '<circle cx="17" cy="6.5" r="2.2" fill="#ffd977"/><path d="M3 16.5l5.5-7 3.8 4.5 2.7-3 6 5.5z" fill="#a8d59a"/><path d="M3 16.5h18v1.5c0 1.4-1.1 2.5-2.5 2.5h-13A2.5 2.5 0 0 1 3 18z" fill="#9cc7ea"/>',
    bridge: '<path d="M3 15q9-9 18 0v-2.6q-9-9-18 0z" fill="#e06a4e"/><path d="M7.5 10.8v2.4M12 8.8v2.4M16.5 10.8v2.4" stroke="#fff" stroke-width="1.3"/><path d="M2 18.5q2.5-1.5 5 0t5 0 5 0 5 0" stroke="#5b9bd5" stroke-width="1.8"/>',
    sunrise: '<path d="M12 4v2.2M5.6 7.6l1.5 1.5M18.4 7.6l-1.5 1.5"/><path d="M5 15a7 7 0 0 1 14 0z" fill="#ffd977"/><path d="M2.5 15h19"/><path d="M2.5 18.5q2.4-1.5 4.75 0t4.75 0 4.75 0 4.75 0" stroke="#5b9bd5" stroke-width="1.8"/>',
    wave: '<path d="M2.5 17c3 0 4-2 4.5-5 .6-3.6 3-6 6.5-6 3 0 5 2 5 4.5-1.6-1.4-4.5-1-4.5 2 0 2.6 2.4 4 5.5 4.5v3h-17z" fill="#9cc7ea"/>',
    moon: '<path d="M15 3.5a8.5 8.5 0 1 0 5.5 14 7 7 0 0 1-5.5-14z" fill="#ffd977"/>',
    tent: '<path d="M12 5V2.5l2.5 1z" fill="#e06a4e" stroke-width="1.2"/><path d="M3 20l9-15 9 15z" fill="#f6b8c4"/><path d="M12 5l-3.5 15M12 5l3.5 15" stroke-width="1.2"/><path d="M10 20l2-5 2 5z" fill="#fff6e0"/>',
    lantern: '<path d="M12 2.5V4M12 19.6v2"/><path d="M7 11.8c0-3.5 2.2-6 5-6s5 2.5 5 6-2.2 6-5 6-5-2.5-5-6z" fill="#e06a4e"/><path d="M7.3 9.8h9.4M7.3 13.8h9.4" stroke-width="1"/><rect x="9" y="4" width="6" height="1.8" rx=".5" fill="#3b4a63"/><rect x="9" y="17.8" width="6" height="1.8" rx=".5" fill="#3b4a63"/>',
    bag: '<path d="M9 8V6.5a3 3 0 0 1 6 0V8"/><path d="M5.5 8h13l-1 12.5h-11z" fill="#f6b8c4"/><path d="M9 8v2M15 8v2"/>',
    cart: '<path d="M6.3 7h14.2l-2 8H7.8z" fill="#c9dcf0"/><path d="M2.5 4h2.8l2.2 11h11"/><circle cx="9" cy="19" r="1.6" fill="#3b4a63"/><circle cx="16.5" cy="19" r="1.6" fill="#3b4a63"/>',
    teddy: '<path d="M8 15.5c-2 1-2.8 3-2.8 5.5h13.6c0-2.5-.8-4.5-2.8-5.5" fill="#f2a65a"/><circle cx="7" cy="6.5" r="2.4" fill="#f2a65a"/><circle cx="17" cy="6.5" r="2.4" fill="#f2a65a"/><circle cx="12" cy="10.5" r="5.8" fill="#f2a65a"/><ellipse cx="12" cy="12.8" rx="2.4" ry="1.8" fill="#fff6e0" stroke-width="1.1"/><circle cx="9.8" cy="9.6" r=".75" fill="#3b4a63" stroke="none"/><circle cx="14.2" cy="9.6" r=".75" fill="#3b4a63" stroke="none"/><circle cx="12" cy="12.2" r=".6" fill="#3b4a63" stroke="none"/>',
    books: '<rect x="4" y="15" width="16" height="4.5" rx="1" fill="#9cc7ea"/><rect x="5.5" y="10.5" width="14" height="4.5" rx="1" fill="#f6b8c4"/><rect x="4.5" y="6" width="13" height="4.5" rx="1" fill="#ffd977"/><path d="M7 17.2h6M8 12.7h6M7 8.2h5" stroke-width="1"/>',
    game: '<path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.6 3a2.5 2.5 0 0 1-4.3 1.2L14.5 16h-5l-1.5 1.6a2.5 2.5 0 0 1-4.3-1.2l-.6-3A4.5 4.5 0 0 1 7.5 8z" fill="#c9dcf0"/><path d="M7.5 10.5v3M6 12h3"/><circle cx="15.5" cy="11" r=".9" fill="#e06a4e" stroke="none"/><circle cx="17.3" cy="12.8" r=".9" fill="#7bbf6a" stroke="none"/>',
    coat: '<path d="M9 3.5l3 2.5 3-2.5 4.5 2.5 1.5 9-2.5.5V21H6.5v-6L4 14.5l1.5-9z" fill="#7bbf6a"/><path d="M12 6v15M9 3.5L12 9l3-5.5" stroke-width="1.3"/>',
    pill: '<g transform="rotate(-45 12 12)"><rect x="4" y="8.5" width="16" height="7" rx="3.5" fill="#fff"/><path d="M12 8.5h4.5a3.5 3.5 0 0 1 0 7H12z" fill="#e06a4e"/></g>',
    dolphin: '<path d="M3 15c2-5 7-8 12-7.5l1.5-2.5 1 3c2 1 3 2.5 3.5 4.5l-2.5-.5c-2 2.5-6 4-10.5 3.5l-1.5 2.5-.5-3c-1 0-2-.2-3-.5z" fill="#9cc7ea"/><circle cx="17" cy="11" r=".7" fill="#3b4a63" stroke="none"/>',
    fish: '<path d="M5.5 12L2 8.3v7.4z" fill="#9cc7ea"/><path d="M5 12c2.5-3.5 5.5-5 9-5 3.4 0 5.6 2 7 5-1.4 3-3.6 5-7 5-3.5 0-6.5-1.5-9-5z" fill="#9cc7ea"/><circle cx="17" cy="11" r=".8" fill="#3b4a63" stroke="none"/><path d="M11 9.5q1.2 2.5 0 5" stroke-width="1.1"/>',
    shrimp: '<path d="M11 19l-2.5 2.5 3.5-.3z" fill="#f2a65a"/><path d="M17 5c-6 0-11 4-11 9 0 3 2 5 5 5l1-2.5c-2 0-3-1-3-2.5 0-3 3.5-5.8 8-6z" fill="#f2a65a"/><path d="M17 5l3-2M17 5.5l3.5.5" stroke-width="1.1"/><path d="M9 11.5l2 1M8.3 14.2l2.2.3M12 9.3l1.6 1.6" stroke-width="1"/>',
    dining: '<path d="M3 4v4.5c0 1 .7 1.8 1.5 1.8S6 9.5 6 8.5V4M4.5 10.3V21" stroke-width="1.3"/><path d="M20.5 4c-1.3 0-2 1.5-2 4s.8 3 2 3V21" stroke-width="1.3"/><circle cx="12.2" cy="12.5" r="5.6" fill="#fff"/><circle cx="12.2" cy="12.5" r="3.4" fill="#fff6e0" stroke-width="1.1"/>',
    ramen: '<path d="M14 3.5l-6 7.5M18 4l-7 7" stroke="#c0704f" stroke-width="1.6"/><path d="M3.5 11.5h17c0 4.5-3.8 8-8.5 8s-8.5-3.5-8.5-8z" fill="#f6b8c4"/><path d="M6 11.5c.8-2 2-2 2.8 0M9.5 11.5c.8-2.2 2-2.2 2.8 0M13 11.5c.8-2 2-2 2.8 0" stroke="#f2a65a" stroke-width="1.4"/><path d="M8 15h8" stroke="#fff" stroke-width="1.2"/>',
    sushi: '<rect x="4" y="12" width="16" height="6.5" rx="3" fill="#fff"/><path d="M4.5 12.5c0-2.8 3.4-4.5 7.5-4.5s7.5 1.7 7.5 4.5c-2 .8-13 .8-15 0z" fill="#f2a65a"/><path d="M8.5 9.6l1.5 2.2M12 9.2l1.4 2.4M15.5 9.6l1.3 2.2" stroke="#fff6e0" stroke-width="1"/>',
    sake: '<path d="M7.5 3h5v2.5c0 1 2.5 2.5 2.5 6.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7c0-4 2.5-5.5 2.5-6.5z" fill="#fff"/><rect x="6.5" y="11" width="7" height="5.5" rx="1" fill="#9cc7ea" stroke-width="1.1"/><path d="M16.5 16.5h5l-.8 4.5h-3.4z" fill="#fff"/>',
    coffee: '<path d="M8.5 6.5c-.8-1 .8-2 0-3.2M12.5 6.5c-.8-1 .8-2 0-3.2" stroke-width="1.2"/><path d="M16.5 10.5h1.3a2.3 2.3 0 0 1 0 4.6h-1.6"/><path d="M4.5 9h12v5.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z" fill="#fff6e0"/><path d="M5.5 11h10" stroke="#c0704f" stroke-width="1.6"/><path d="M3 21h15"/>',
    cake: '<path d="M3.5 12.5L18 7l2.5 5.5z" fill="#fff6e0"/><path d="M3.5 12.5h17v7h-17z" fill="#fff6e0"/><path d="M3.5 15.8h17" stroke="#f6b8c4" stroke-width="2"/><circle cx="17" cy="5.3" r="1.8" fill="#e06a4e"/>',
    bento: '<rect x="3" y="6" width="18" height="13" rx="2" fill="#5a6b85"/><rect x="4.5" y="7.5" width="7.5" height="10" rx="1" fill="#fff" stroke-width="1.1"/><rect x="13" y="7.5" width="6.5" height="4.5" rx="1" fill="#a8d59a" stroke-width="1.1"/><rect x="13" y="13" width="6.5" height="4.5" rx="1" fill="#f2a65a" stroke-width="1.1"/><circle cx="8.2" cy="12.5" r="1.3" fill="#e06a4e" stroke="none"/>',
    meat: '<path d="M6 6c4-3 11-2 13.5 2.5 2 3.7-.5 8-4 9.5-4 1.7-6 .5-9.5 2.5C4 18 3 14.5 3.5 11.5 3.8 9.5 4.5 7.2 6 6z" fill="#e06a4e"/><path d="M9 10c2-1.5 5-1.5 6.5.5" stroke="#fff6e0" stroke-width="1.4"/><circle cx="16" cy="13" r="1.5" fill="#fff6e0" stroke-width="1"/>',
    bacon: '<path d="M4 6.5q4-3 8 0t8 0v4q-4 3-8 0t-8 0z" fill="#e06a4e"/><path d="M4 13.5q4-3 8 0t8 0v4q-4 3-8 0t-8 0z" fill="#f6b8c4"/>',
    egg: '<path d="M15.5 8l5-5" stroke-width="2.2"/><circle cx="10.5" cy="13" r="7" fill="#5a6b85"/><path d="M6.5 12c0-2.5 2-4 4-3.6 2.3-.6 4 1.5 3.6 3.8.2 2.4-2 3.8-4 3.4-2.2.3-3.8-1.4-3.6-3.6z" fill="#fff"/><circle cx="10.5" cy="12.3" r="1.6" fill="#ffd977"/>',
    greens: '<path d="M12 21c-4-1-7-4.5-7-9 0-4 2.5-7 7-8.5 4.5 1.5 7 4.5 7 8.5 0 4.5-3 8-7 9z" fill="#a8d59a"/><path d="M12 21V8M12 13l-3.5-3M12 16l3.5-3.5" stroke-width="1.2"/>',
    warn: '<path d="M12 3.5L21.5 20h-19z" fill="#ffd977"/><path d="M12 9.5v5" stroke-width="2"/><circle cx="12" cy="17.2" r=".7" fill="#3b4a63"/>',
    bulb: '<path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V17h5v-1.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="#ffd977"/><path d="M9.5 19h5M10.5 21h3"/><path d="M12 17v-4.5l-1.5-1.5M12 12.5l1.5-1.5" stroke-width="1"/>',
    gem: '<path d="M3 9l3.5-4.5h11L21 9l-9 11.5z" fill="#9cc7ea"/><path d="M3 9h18M7.5 9L12 4.5 16.5 9M7.5 9L12 20.5 16.5 9" stroke-width="1.1"/>',
    maple: '<path d="M12 17v4.5"/><path d="M12 2.5l1.5 3.5 2.5-1-.5 4 3.5-1.5-1 3 3 1-4 2.5.8 2-4-.8-.6 2.8-1.2 1-1.2-1-.6-2.8-4 .8.8-2-4-2.5 3-1-1-3 3.5 1.5-.5-4 2.5 1z" fill="#e06a4e"/>',
    alarm: '<path d="M4 6.5a3 3 0 0 1 4-3zM20 6.5a3 3 0 0 0-4-3z" fill="#e06a4e"/><path d="M7 19.5l-1.5 2M17 19.5l1.5 2"/><circle cx="12" cy="13" r="7" fill="#fff6e0"/><path d="M12 9v4l2.5 2"/>',
    clock: '<circle cx="12" cy="12" r="8.5" fill="#fff6e0"/><path d="M12 7v5l3-1.7"/>',
    next: '<path d="M3.5 6l7 6-7 6z" fill="#7bbf6a"/><path d="M10.5 6l7 6-7 6z" fill="#7bbf6a"/><path d="M20 6v12" stroke-width="2"/>',
    finish: '<path d="M5 21V3.5"/><path d="M5 4h13.5l-2.5 4 2.5 4H5z" fill="#fff"/><path d="M5 4h3.4v2.7H5zM11.8 4h3.4v2.7h-3.4zM8.4 6.7h3.4v2.6H8.4zM15.2 6.7h2.4l-.9 1.3.9 1.3h-2.4zM5 9.3h3.4V12H5zM11.8 9.3h3.4V12h-3.4z" fill="#3b4a63" stroke="none"/>',
    search: '<path d="M14.5 14.5l6 6" stroke-width="2.6"/><circle cx="10" cy="10" r="6" fill="#c9dcf0"/><path d="M7.5 8.5a3 3 0 0 1 2.5-2" stroke="#fff" stroke-width="1.3"/>',
    check: '<rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="#7bbf6a"/><path d="M8 12.5l3 3 5.5-6.5" stroke="#fff" stroke-width="2.4"/>',
    doc: '<path d="M6 3h8.5L19 7.5V21H6z" fill="#fff"/><path d="M14.5 3v4.5H19"/><path d="M8.5 11h7.5M8.5 14h7.5M8.5 17h5" stroke-width="1.1"/>',
    phone: '<path d="M6.5 3.5l3 .5 1.3 4-2 1.5c1 2.3 2.8 4.2 5.2 5.2l1.5-2 4 1.3.5 3c-.2 1.5-1.4 2.5-3 2.5C10 19.5 4.5 14 4.5 6.5c0-1.6 1-2.8 2-3z" fill="#7bbf6a"/>',
    sparkle: '<path d="M10 3.5l1.6 4.4L16 9.5l-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6z" fill="#ffd977"/><path d="M17.5 13.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" fill="#ffd977" stroke-width="1.2"/>',
    money: '<path d="M9 4.5h6l-1.5 3h-3z" fill="#f2a65a"/><path d="M10.5 7.5h3c4 2.5 6.5 6 6.5 9 0 2.8-2 4-8 4s-8-1.2-8-4c0-3 2.5-6.5 6.5-9z" fill="#ffd977"/><path d="M10 11.5l2 3 2-3M12 14.5v4M10 15.6h4M10 17.4h4" stroke-width="1.3"/>',
    info: '<circle cx="12" cy="12" r="9" fill="#9cc7ea"/><path d="M12 10.8v6" stroke="#fff" stroke-width="2.2"/><circle cx="12" cy="7.3" r="1.3" fill="#fff" stroke="none"/>',
    calendar: '<path d="M8 3v4M16 3v4"/><rect x="3.5" y="5" width="17" height="15.5" rx="2" fill="#fff"/><path d="M3.5 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v2.5h-17z" fill="#e06a4e"/><path d="M7 13h2M11 13h2M15 13h2M7 16.5h2M11 16.5h2" stroke-width="1.6"/>',
    thermo: '<path d="M10 4.5a2 2 0 0 1 4 0v9.2a4 4 0 1 1-4 0z" fill="#fff"/><path d="M12 8v8" stroke="#e06a4e" stroke-width="2"/><circle cx="12" cy="17" r="2.2" fill="#e06a4e" stroke="none"/>',
    umbrella: '<path d="M12 2.5v1M12 11.5v7a2 2 0 0 1-4 0"/><path d="M3 11.5a9 9 0 0 1 18 0c-1.2-1.2-3-1.2-4.5 0-1.2-1.2-3.3-1.2-4.5 0-1.2-1.2-3.3-1.2-4.5 0-1.5-1.2-3.3-1.2-4.5 0z" fill="#f6b8c4"/>',
    jpflag: '<rect x="2.5" y="5.5" width="19" height="13" rx="1.5" fill="#fff"/><circle cx="12" cy="12" r="3.6" fill="#e06a4e"/>',
    // 家計簿
    ferris: '<path d="M8.5 21L12 11.5 15.5 21M7 21h10"/><circle cx="12" cy="10" r="7" fill="#fff6e0"/><path d="M12 3v14M5 10h14M7 5l10 10M17 5L7 15" stroke-width="1"/><circle cx="12" cy="10" r="1.6" fill="#f6b8c4"/><circle cx="12" cy="3" r="1.4" fill="#e06a4e"/><circle cx="19" cy="10" r="1.4" fill="#ffd977"/><circle cx="5" cy="10" r="1.4" fill="#9cc7ea"/><circle cx="12" cy="17" r="1.4" fill="#7bbf6a"/>',
    gift: '<rect x="4" y="10" width="16" height="11" rx="1.5" fill="#f6b8c4"/><rect x="3" y="7" width="18" height="4" rx="1" fill="#f6b8c4"/><path d="M12 7v14" stroke="#e06a4e" stroke-width="2.2"/><path d="M12 7c-1.5-3-5-4-5-1.5S10 7 12 7zM12 7c1.5-3 5-4 5-1.5S14 7 12 7z" fill="#ffd977"/>',
    lock: '<path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#ffd977"/><circle cx="12" cy="14.8" r="1.4" fill="#3b4a63"/><path d="M12 15.5v2"/>',
    unlock: '<path d="M8 10.5V8a4 4 0 0 1 7.6-1.7"/><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="#a8d59a"/><circle cx="12" cy="14.8" r="1.4" fill="#3b4a63"/><path d="M12 15.5v2"/>',
    cross: '<rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="#e06a4e"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="#fff" stroke-width="2.4"/>',
    pencil: '<path d="M4 20l1-4.5L15.5 5a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.5 19z" fill="#ffd977"/><path d="M14 6.5l3.5 3.5"/><path d="M4 20l1-4.5 3.5 3.5z" fill="#f3e6c8"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="17" rx="2" fill="#f3e6c8"/><rect x="9" y="3" width="6" height="3.5" rx="1" fill="#9cc7ea"/><path d="M8 11h8M8 14.5h8M8 18h5" stroke-width="1.2"/>',
    penguin: '<path d="M8.5 21h2.5M13 21h2.5" stroke="#f2a65a" stroke-width="1.8"/><ellipse cx="12" cy="12.5" rx="6.5" ry="8" fill="#3b4a63"/><ellipse cx="12" cy="14.3" rx="4.3" ry="5.6" fill="#fff" stroke="none"/><circle cx="10" cy="8.6" r="1" fill="#fff" stroke="none"/><circle cx="14" cy="8.6" r="1" fill="#fff" stroke="none"/><path d="M10.8 10.4h2.4L12 12z" fill="#f2a65a" stroke-width="1"/>',
    card: '<rect x="3" y="5.5" width="18" height="13" rx="2.2" fill="#9cc7ea"/><path d="M3 9.5h18" stroke-width="2.6"/><rect x="6" y="13" width="5" height="2.5" rx=".6" fill="#ffd977" stroke-width="1"/>',
    greenheart: '<path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z" fill="#7bbf6a"/>',
    yen: '<rect x="2.5" y="6" width="19" height="12" rx="1.8" fill="#f3e6c8"/><path d="M5 9v6M19 9v6" stroke-width="1"/><circle cx="12" cy="12" r="3.6" fill="#fff" stroke-width="1.2"/><path d="M10.5 10.3l1.5 2 1.5-2M12 12.3v2.5M10.6 12.9h2.8" stroke-width="1.1"/>',
    bear: '<circle cx="6.5" cy="6.5" r="2.6" fill="#c0704f"/><circle cx="17.5" cy="6.5" r="2.6" fill="#c0704f"/><circle cx="12" cy="13" r="7.5" fill="#c0704f"/><ellipse cx="12" cy="15.5" rx="3" ry="2.3" fill="#f3e6c8" stroke-width="1.1"/><circle cx="9.3" cy="11.5" r=".85" fill="#3b4a63" stroke="none"/><circle cx="14.7" cy="11.5" r=".85" fill="#3b4a63" stroke="none"/><circle cx="12" cy="14.7" r=".8" fill="#3b4a63" stroke="none"/>',
    reddot: '<circle cx="12" cy="12" r="7.5" fill="#e06a4e"/>',
    yellowdot: '<circle cx="12" cy="12" r="7.5" fill="#ffd977"/>',
    bluesq: '<rect x="4.5" y="4.5" width="15" height="15" rx="3" fill="#5b9bd5"/>',
    plus: '<path d="M12 5v14M5 12h14" stroke-width="2.6"/>',
    // 其他工具頁
    fire: '<path d="M12 21.5c-4 0-6.5-2.7-6.5-6.3 0-3.4 2.4-5 3.4-8 1.6 1.3 2 2.8 1.8 4.3 1.6-1 2.6-3.3 2.3-7 3.6 2 6.5 5.7 6.5 10.4 0 3.8-3 6.6-7.5 6.6z" fill="#f2a65a"/><path d="M12 21.5c-1.8 0-3-1.2-3-2.9 0-1.8 1.4-2.6 2-4.3 1.8 1 4 2.5 4 4.4 0 1.7-1.3 2.8-3 2.8z" fill="#ffd977" stroke-width="1.2"/>',
    pushpin: '<path d="M11 13.5l-6 6.5" stroke-width="1.8"/><path d="M14.5 3l6.5 6.5-2 .8-3.3 3.3.5 3.6-1.6 1.6L5.2 9.4l1.6-1.6 3.6.5 3.3-3.3z" fill="#e06a4e"/>',
    nosmoke: '<rect x="4" y="11" width="13" height="3.2" rx=".5" fill="#fff"/><rect x="14" y="11" width="3" height="3.2" fill="#f2a65a" stroke-width="1.2"/><path d="M18.5 9.5c0-1.5 1-1.5 1-3" stroke-width="1.2"/><circle cx="12" cy="12" r="9" stroke="#e06a4e" stroke-width="2.2"/><path d="M5.6 5.6l12.8 12.8" stroke="#e06a4e" stroke-width="2.2"/>',
    person: '<circle cx="12" cy="8" r="4" fill="#ffd977"/><path d="M4.5 21c0-4.2 3.4-7 7.5-7s7.5 2.8 7.5 7z" fill="#9cc7ea"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3" stroke="#5b9bd5" stroke-width="2.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3" stroke="#5b9bd5" stroke-width="2.2"/>',
    paw: '<path d="M12 12c-3 0-6 3-6 5.8 0 2 1.6 2.7 3 2.2 1.2-.4 2-.8 3-.8s1.8.4 3 .8c1.4.5 3-.2 3-2.2C18 15 15 12 12 12z" fill="#f6b8c4"/><ellipse cx="5.2" cy="10" rx="1.8" ry="2.3" fill="#f6b8c4"/><ellipse cx="9.3" cy="6" rx="1.9" ry="2.5" fill="#f6b8c4"/><ellipse cx="14.7" cy="6" rx="1.9" ry="2.5" fill="#f6b8c4"/><ellipse cx="18.8" cy="10" rx="1.8" ry="2.3" fill="#f6b8c4"/>',
    volleyball: '<circle cx="12" cy="12" r="8.5" fill="#fff"/><path d="M12 3.5c-.5 4 .5 7 3.5 9.5M12 12c-3.5 1.5-6 1-8.3-.6M12 12c1.5 3.7 1.2 6.2-.2 8.5M15.5 13c2.3-1 3.7-2.6 4.8-4.6M6 6.2c2 .3 4.2 1.8 6 5.8" stroke-width="1.3" stroke="#5b9bd5"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="#ffd977"/>',
    hamster: '<circle cx="7" cy="7" r="2.3" fill="#f6b8c4"/><circle cx="17" cy="7" r="2.3" fill="#f6b8c4"/><path d="M12 5.5c5 0 8 3.5 8 8 0 4.5-3.6 7-8 7s-8-2.5-8-7c0-4.5 3-8 8-8z" fill="#f2c48d"/><path d="M12 11c3 0 5.5 2 5.5 5 0 2.4-2.4 4-5.5 4s-5.5-1.6-5.5-4c0-3 2.5-5 5.5-5z" fill="#fff6e0" stroke="none"/><circle cx="9.3" cy="11" r=".9" fill="#3b4a63" stroke="none"/><circle cx="14.7" cy="11" r=".9" fill="#3b4a63" stroke="none"/><path d="M11.2 13.3h1.6L12 14.3z" fill="#e06a4e" stroke-width=".9"/><circle cx="7.6" cy="13.3" r="1.2" fill="#f6b8c4" stroke="none"/><circle cx="16.4" cy="13.3" r="1.2" fill="#f6b8c4" stroke="none"/>',
    herb: '<path d="M12 21.5V8" stroke-width="1.8"/><path d="M12 15c-5 0-7.5-3-7.5-6.5 4 0 7.5 2 7.5 6.5z" fill="#a8d59a"/><path d="M12 12c5 0 7.5-3 7.5-6.5-4 0-7.5 2-7.5 6.5z" fill="#7bbf6a"/><path d="M12 8c-1.6-1.5-1.6-3.5 0-5.5 1.6 2 1.6 4 0 5.5z" fill="#a8d59a"/>',
    ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" fill="#f6b8c4"/><path d="M15 7v10" stroke-dasharray="1.5 2" stroke-width="1.2"/><path d="M6.5 10.5h5M6.5 13.5h4" stroke-width="1.2"/>',
    flags: '<path d="M5 21L9 4M19 21L15 4"/><path d="M9 4l-7 3.5 6 3.5z" fill="#fff"/><path d="M15 4l7 3.5-6 3.5z" fill="#fff"/><circle cx="6.6" cy="7.4" r="1.2" fill="#e06a4e" stroke="none"/><circle cx="17.4" cy="7.4" r="1.2" fill="#e06a4e" stroke="none"/>',
    plug: '<path d="M9 3v4.5M15 3v4.5" stroke-width="2"/><path d="M6 7.5h12v3.5a6 6 0 0 1-12 0z" fill="#ffd977"/><path d="M12 17v4.5" stroke-width="2"/>',
    sneaker: '<path d="M3 17.5V9.5c2 0 3.5 1 4.8 1l2-3.5c3 2 4 4 6.2 5.5 2 .8 5 1.5 5 4v1z" fill="#9cc7ea"/><path d="M3 17.5h18v1.5c0 .8-.6 1.5-1.5 1.5h-15c-.9 0-1.5-.7-1.5-1.5z" fill="#fff"/><path d="M9.2 10.5l1.6 1M11 9l1.6 1" stroke-width="1.1"/>',
    mobile: '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5" fill="#5a6b85"/><rect x="8" y="5" width="8" height="12.5" rx="1" fill="#c9dcf0" stroke-width="1.1"/><circle cx="12" cy="19.5" r=".8" fill="#fff" stroke="none"/>',
    exchange: '<circle cx="8" cy="9" r="5.5" fill="#ffd977"/><circle cx="16" cy="15" r="5.5" fill="#a8d59a"/><path d="M6.3 7.2L8 9.3l1.7-2.1M8 9.3v2.6M6.6 10h2.8" stroke-width="1.1"/><path d="M16 12.3v5.4M17.6 13.3c-.4-.5-1-.7-1.6-.7-.9 0-1.6.5-1.6 1.2 0 1.5 3.3.8 3.3 2.4 0 .7-.7 1.2-1.7 1.2-.7 0-1.3-.3-1.7-.8" stroke-width="1.1"/>',
    receipt: '<path d="M5.5 2.5h13v19l-2.2-1.5-2.1 1.5-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5z" fill="#fff"/><path d="M8.5 7h7M8.5 10.5h7M8.5 14h4" stroke-width="1.2"/><path d="M14 14h1.5" stroke="#e06a4e" stroke-width="1.6"/>',
    camera: '<path d="M3 8.5c0-1.1.9-2 2-2h2.5L9 4h6l1.5 2.5H19c1.1 0 2 .9 2 2V18c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2z" fill="#c9dcf0"/><circle cx="12" cy="13" r="4" fill="#fff"/><circle cx="12" cy="13" r="2" fill="#5a6b85" stroke="none"/><circle cx="17.8" cy="9.3" r=".8" fill="#e06a4e" stroke="none"/>',
    refresh: '<path d="M19.5 12a7.5 7.5 0 0 1-13.4 4.6M4.5 12a7.5 7.5 0 0 1 13.4-4.6" stroke="#5b9bd5" stroke-width="2.2"/><path d="M18.3 3.3l-.4 4.1-4.1-.4M5.7 20.7l.4-4.1 4.1.4" stroke="#5b9bd5" stroke-width="2.2"/>',
    twflag: '<rect x="2.5" y="5.5" width="19" height="13" rx="1.5" fill="#e06a4e"/><path d="M2.5 7a1.5 1.5 0 0 1 1.5-1.5h8V12H2.5z" fill="#5b9bd5"/><circle cx="7.2" cy="8.8" r="1.7" fill="#fff" stroke-width="1"/>',
    trash: '<path d="M4 6.5h16M9.5 6.5V4.5h5v2"/><path d="M5.5 6.5h13l-1 14h-11z" fill="#c9dcf0"/><path d="M10 10v7M14 10v7" stroke-width="1.3"/>',
    gear: '<path d="M10.3 2.5h3.4l.5 2.6 2 1 2.3-1.4 2.4 2.4-1.4 2.3.9 2 2.6.5v3.4l-2.6.5-.9 2 1.4 2.3-2.4 2.4-2.3-1.4-2 .9-.5 2.6h-3.4l-.5-2.6-2-.9-2.3 1.4-2.4-2.4 1.4-2.3-.9-2-2.6-.5v-3.4l2.6-.5.9-2-1.4-2.3 2.4-2.4 2.3 1.4 2-1z" fill="#c9dcf0"/><circle cx="12" cy="12" r="3.2" fill="#fff"/>',
    floppy: '<path d="M4 5.5c0-.8.7-1.5 1.5-1.5h11l3.5 3.5v11c0 .8-.7 1.5-1.5 1.5h-13c-.8 0-1.5-.7-1.5-1.5z" fill="#5b9bd5"/><rect x="7.5" y="4" width="8" height="5" fill="#fff" stroke-width="1.2"/><rect x="7" y="13" width="10" height="7" rx="1" fill="#fff6e0" stroke-width="1.2"/>',
    robot: '<path d="M12 3.5V6"/><circle cx="12" cy="3" r="1.2" fill="#e06a4e"/><rect x="4.5" y="6" width="15" height="12" rx="3.5" fill="#c9dcf0"/><circle cx="9" cy="11.5" r="1.6" fill="#fff"/><circle cx="15" cy="11.5" r="1.6" fill="#fff"/><path d="M9.5 15h5" stroke-width="1.3"/><path d="M2.5 11v3M21.5 11v3" stroke-width="2"/>',
    bluedot: '<circle cx="12" cy="12" r="7.5" fill="#5b9bd5"/>',
    purpledot: '<circle cx="12" cy="12" r="7.5" fill="#a78bd4"/>',
    target: '<circle cx="12" cy="12" r="9" fill="#fff"/><circle cx="12" cy="12" r="6" fill="#e06a4e"/><circle cx="12" cy="12" r="3" fill="#fff"/><circle cx="12" cy="12" r="1" fill="#e06a4e" stroke="none"/><path d="M12 12l7-7M17 3.5l2 1.5 1.5 2" stroke-width="1.6"/>',
    conbini: '<rect x="3.5" y="8" width="17" height="12.5" fill="#fff"/><path d="M3 8h18V5H3z" fill="#7bbf6a"/><path d="M3 10.5h18" stroke="#f2a65a" stroke-width="2"/><rect x="6" y="13.5" width="5" height="7" fill="#c9dcf0" stroke-width="1.2"/><rect x="13" y="13.5" width="5" height="4" fill="#c9dcf0" stroke-width="1.2"/>',
    trophy: '<path d="M7.5 5.5H4.5c0 3 1.2 5 3.5 5.3M16.5 5.5h3c0 3-1.2 5-3.5 5.3"/><path d="M7 3.5h10v5a5 5 0 0 1-10 0z" fill="#ffd977"/><path d="M12 13.5v3.5"/><path d="M8 21h8l-1-4H9z" fill="#f2a65a"/>',
    smile: '<circle cx="12" cy="12" r="9" fill="#ffd977"/><circle cx="9" cy="10.2" r="1" fill="#3b4a63" stroke="none"/><circle cx="15" cy="10.2" r="1" fill="#3b4a63" stroke="none"/><path d="M8.5 14q3.5 3.2 7 0"/>',
    pinch: '<path d="M7 20c-2-2-2.5-4.5-1.5-7l2-5c.4-1 1.5-1.4 2.4-.9.8.4 1 1.3.7 2.1l-1 2.8 4.5-6.5c.6-.8 1.7-1 2.5-.4.8.6.9 1.6.4 2.4L14.5 11h3c1.4 0 2.2 1.5 1.5 2.7L16 19c-1 1.6-2.6 2.5-4.5 2.5H10c-1.2 0-2.2-.5-3-1.5z" fill="#f2c48d"/><path d="M15.3 3.5l1.7-1.5M18 6.5l2-.5" stroke-width="1.2"/>',
    party: '<path d="M3.5 20.5l4-12 8 8z" fill="#ffd977"/><path d="M5.6 14.2l4.2 4.2M6.8 10.7l6.5 6.5" stroke="#e06a4e" stroke-width="1.3"/><path d="M13 7c1.5-1.5 1-3 2.5-4M16.5 11c1.5-.5 3 0 4-1.5M14.5 9.5L18 6" stroke-width="1.4"/><circle cx="19.5" cy="3.5" r="1" fill="#f6b8c4"/><circle cx="20.5" cy="14" r="1" fill="#9cc7ea"/><circle cx="11" cy="3" r=".9" fill="#7bbf6a"/>',
    idcard: '<rect x="2.5" y="5" width="19" height="14" rx="2" fill="#fff6e0"/><circle cx="8" cy="11" r="2.3" fill="#ffd977" stroke-width="1.2"/><path d="M4.8 16.3c.4-1.8 1.7-2.8 3.2-2.8s2.8 1 3.2 2.8z" fill="#9cc7ea" stroke-width="1.2"/><path d="M13.5 9.5h5M13.5 12.5h5M13.5 15.5h3" stroke-width="1.2"/>',
    puzzle: '<path d="M4 8h4a2.3 2.3 0 1 1 4.5 0H16v4a2.3 2.3 0 1 1 0 4.5V20H4z" fill="#a8d59a"/><path d="M12.5 8v4.5a2.3 2.3 0 1 0 0 3.5V20" stroke-width="1.1"/>',
    notepad: '<rect x="5" y="4" width="14" height="17" rx="1.5" fill="#fff6e0"/><path d="M5 7.5h14" stroke="#e06a4e" stroke-width="1.6"/><path d="M8 3v2.5M12 3v2.5M16 3v2.5" stroke-width="1.4"/><path d="M8 11h8M8 14h8M8 17h5" stroke-width="1.1"/>',
    dollar: '<rect x="2.5" y="6" width="19" height="12" rx="1.8" fill="#a8d59a"/><path d="M5 9v6M19 9v6" stroke-width="1"/><circle cx="12" cy="12" r="3.6" fill="#fff" stroke-width="1.2"/><path d="M13 10.6c-.3-.4-.6-.5-1-.5-.6 0-1 .4-1 .8 0 1 2 .6 2 1.7 0 .5-.4.9-1.1.9-.4 0-.8-.2-1.1-.5M12 9.5v5" stroke-width="1"/>',
    hourglass: '<path d="M6 3h12M6 21h12"/><path d="M7 3h10c0 4-2.5 6-5 9-2.5-3-5-5-5-9z" fill="#fff"/><path d="M7 21h10c0-4-2.5-6-5-9-2.5 3-5 5-5 9z" fill="#fff"/><path d="M9.5 19.5h5c-.5-2-1.5-3-2.5-4-1 1-2 2-2.5 4z" fill="#ffd977" stroke="none"/>',
    folders: '<path d="M3 7.5V18c0 .8.7 1.5 1.5 1.5H18" stroke-width="1.4"/><path d="M5.5 5.5c0-.6.4-1 1-1h4l1.5 2h7.5c.6 0 1 .4 1 1V16c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1z" fill="#ffd977"/><path d="M5.5 9h15" stroke-width="1.1"/>',
    tag: '<path d="M3 4.5v6.3c0 .4.2.8.4 1l9.3 9.3c.6.6 1.5.6 2.1 0l6.3-6.3c.6-.6.6-1.5 0-2.1l-9.3-9.3c-.3-.3-.6-.4-1-.4H4.5C3.7 3 3 3.7 3 4.5z" fill="#f6b8c4"/><circle cx="7.5" cy="7.5" r="1.6" fill="#fff"/>',
    chart: '<path d="M3.5 3.5v17h17"/><rect x="6.5" y="12" width="3" height="6.5" fill="#9cc7ea" stroke-width="1.3"/><rect x="11.5" y="7.5" width="3" height="11" fill="#f2a65a" stroke-width="1.3"/><rect x="16.5" y="10" width="3" height="8.5" fill="#a8d59a" stroke-width="1.3"/>',
    picture: '<rect x="3" y="4.5" width="18" height="15" rx="2" fill="#e3f0fb"/><circle cx="8.5" cy="9.5" r="1.8" fill="#ffd977"/><path d="M3.5 17.5l5-5 3.5 3.5 3-3 5.5 5.5z" fill="#a8d59a"/>',
    shirt: '<path d="M8.5 3.5L4 6l-1.5 4.5 3 1V20.5h13v-9l3-1L20 6l-4.5-2.5c-.5 1.6-1.8 2.5-3.5 2.5s-3-.9-3.5-2.5z" fill="#9cc7ea"/>',
    // 天氣
    sun: SUN,
    suncloud: `<g transform="translate(-3 -3) scale(.78)">${SUN}</g><path transform="translate(4.5 4) scale(.8)" d="${CLOUD}" fill="#fff"/>`,
    partcloud: `<g transform="translate(5 -2) scale(.7)">${SUN}</g><path transform="translate(-1 2)" d="${CLOUD}" fill="#fff"/>`,
    cloud: `<path d="${CLOUD}" fill="#fff"/>`,
    fog: '<path d="M4 7h12M7 11h13M4 15h11M9 19h10" stroke-width="2"/>',
    sunrain: `<g transform="translate(5 -4) scale(.68)">${SUN}</g><path transform="translate(-1 -4)" d="${CLOUD}" fill="#fff"/>${RAIN}`,
    rain: `<path transform="translate(0 -4)" d="${CLOUD}" fill="#c9dcf0"/>${RAIN}`,
    snow: `<path transform="translate(0 -4)" d="${CLOUD}" fill="#fff"/>${SNOW.replace(/#fff/g, '#c9dcf0')}`,
    snowflake: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" stroke="#5b9bd5" stroke-width="1.8"/><path d="M10 4.5l2 1.8 2-1.8M10 19.5l2-1.8 2 1.8" stroke="#5b9bd5" stroke-width="1.4"/>',
    storm: `<path transform="translate(0 -4)" d="${CLOUD}" fill="#c9d0dc"/><path d="M12.5 14l-3 4.2h2.6l-1.6 4 4.5-5.4h-2.7l1.4-2.8z" fill="#ffd977" stroke-width="1.2"/>`
  };

  // emoji → 圖示（不含 FE0F 變體符號）
  const MAP = {
    '📍':'pin','🚌':'bus','🚗':'car','🚕':'taxi','🚃':'tram','🚉':'station','✈':'plane','🛫':'takeoff','🛬':'landing',
    '🛶':'canoe','⛵':'sailboat','🚶':'walk','🛂':'passport','🧳':'suitcase','🎒':'backpack',
    '🏯':'castle','🏨':'hotel','🏠':'house','🏬':'store','🏛':'museum','🛕':'temple','⛩':'torii','🌳':'tree',
    '🏞':'park','🌉':'bridge','🌅':'sunrise','🌊':'wave','🌙':'moon','🎪':'tent','🏮':'lantern',
    '🛍':'bag','🛒':'cart','🧸':'teddy','📚':'books','🎮':'game','🧥':'coat','💊':'pill','🐬':'dolphin','🐟':'fish','🦐':'shrimp',
    '🍽':'dining','🍜':'ramen','🍣':'sushi','🍶':'sake','☕':'coffee','🍰':'cake','🍱':'bento','🥩':'meat','🥓':'bacon','🍳':'egg','🥬':'greens',
    '⚠':'warn','💡':'bulb','💎':'gem','🍁':'maple','⏰':'alarm','🕐':'clock','⏭':'next','🏁':'finish','🔎':'search','🔍':'search',
    '✅':'check','📄':'doc','📞':'phone','✨':'sparkle','💰':'money','ℹ':'info','🗓':'calendar','📅':'calendar','🌡':'thermo','☔':'umbrella',
    '🇯🇵':'jpflag',
    '🔥':'fire','📌':'pushpin','🚭':'nosmoke','👤':'person','🔗':'link','🐾':'paw','🏐':'volleyball','⭐':'star','🌟':'star',
    '🐹':'hamster','🌿':'herb','🎫':'ticket','🎌':'flags','🔌':'plug','👟':'sneaker','📱':'mobile','💱':'exchange','🧾':'receipt',
    '📸':'camera','📷':'camera','🔄':'refresh','🔁':'refresh','🇹🇼':'twflag','🗑':'trash','⚙':'gear','💾':'floppy','🤖':'robot',
    '🔵':'bluedot','🟣':'purpledot','🎯':'target','🏪':'conbini','🏆':'trophy','🙂':'smile','🤏':'pinch','🎉':'party','🪪':'idcard',
    '🧩':'puzzle','🗒':'notepad','💵':'dollar','⏳':'hourglass','🗂':'folders','🏷':'tag','📊':'chart','🖼':'picture','👕':'shirt',
    '🎡':'ferris','🎁':'gift','🔒':'lock','🔓':'unlock','❌':'cross','✏':'pencil','📋':'clipboard','🐧':'penguin','💳':'card',
    '💚':'greenheart','💴':'yen','🐻':'bear','🔴':'reddot','🟡':'yellowdot','🟦':'bluesq','➕':'plus',
    '☀':'sun','🌤':'suncloud','⛅':'partcloud','☁':'cloud','🌫':'fog','🌦':'sunrain','🌧':'rain','🌨':'snow','❄':'snowflake','⛈':'storm'
  };

  const SVGNS = 'http://www.w3.org/2000/svg';
  const STROKE = 'fill="none" stroke="#3b4a63" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';
  const sprite = '<svg xmlns="' + SVGNS + '" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">'
    + '<defs><filter id="di-crayon" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="0.9" xChannelSelector="R" yChannelSelector="G"/></filter></defs>'
    + Object.keys(I).map(k => `<symbol id="di-${k}" viewBox="0 0 24 24"><g ${STROKE} filter="url(#di-crayon)">${I[k]}</g></symbol>`).join('')
    + '</svg>';

  const css = '.di{display:inline-block;width:1.25em;height:1.25em;vertical-align:-.25em;overflow:visible;flex-shrink:0;pointer-events:none;}';

  function iconHTML(name){
    return `<svg class="di di-${name}" aria-hidden="true" focusable="false"><use href="#di-${name}"/></svg>`;
  }
  window.doodleIcon = iconHTML;

  const keys = Object.keys(MAP).sort((a, b) => b.length - a.length)
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const RE = new RegExp('(' + keys.join('|') + ')\\uFE0F?', 'gu');
  const SKIP = new Set(['SCRIPT','STYLE','TEXTAREA','OPTION','TITLE','NOSCRIPT']);

  function swapText(node){
    const p = node.parentNode;
    if(!p || SKIP.has(p.nodeName) || p.closest?.('svg')) return;
    const text = node.nodeValue;
    RE.lastIndex = 0;
    if(!RE.test(text)) return;
    RE.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0, m;
    while((m = RE.exec(text))){
      if(m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      const tpl = document.createElement('template');
      tpl.innerHTML = iconHTML(MAP[m[1]]);
      frag.appendChild(tpl.content);
      last = m.index + m[0].length;
    }
    if(last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    p.replaceChild(frag, node);
  }
  function scan(root){
    if(root.nodeType === 3){ swapText(root); return; }
    if(root.nodeType !== 1 || SKIP.has(root.nodeName)) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const list = [];
    while(w.nextNode()) list.push(w.currentNode);
    list.forEach(swapText);
  }

  function install(){
    if(document.getElementById('di-sprite')) return;
    const holder = document.createElement('div');
    holder.id = 'di-sprite';
    holder.innerHTML = sprite;
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    (document.body || document.documentElement).prepend(holder);
    const st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
  }

  install();
  const mo = new MutationObserver(recs => {
    for(const r of recs){
      if(r.type === 'characterData') swapText(r.target);
      else r.addedNodes.forEach(scan);
    }
  });
  mo.observe(document.documentElement, { childList:true, subtree:true, characterData:true });
  scan(document.body || document.documentElement);
  document.addEventListener('DOMContentLoaded', () => scan(document.body));
})();
