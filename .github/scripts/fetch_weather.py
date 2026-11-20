"""Fetch Kochi trip forecasts from Open-Meteo and write weather.json (served by GitHub Pages)."""
import json, urllib.request, datetime, time, sys


def fetch(url, tries=3):
    for i in range(tries):
        try:
            with urllib.request.urlopen(url, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            print(f"第 {i+1} 次失敗：{e}")
            if i < tries - 1:
                time.sleep(10 * (i + 1))
    return None

POINTS = {
    "default":    {"lat": 33.5597, "lon": 133.5311, "name": "高知市"},
    "2026-11-30": {"lat": 33.60,   "lon": 133.20,   "name": "仁淀川一帶"},
}
DAILY = "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"

out = {"source": "Open-Meteo.com (CC BY 4.0)", "points": {}}
for key, p in POINTS.items():
    url = ("https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
           "&daily={d}&timezone=Asia%2FTokyo&forecast_days=16").format(lat=p["lat"], lon=p["lon"], d=DAILY)
    j = fetch(url)
    if j is None:
        print("Open-Meteo 暫時連不上，保留舊的 weather.json")
        sys.exit(0)
    out["points"][key] = {"name": p["name"], "daily": j["daily"]}

out["updated"] = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).isoformat(timespec="minutes")
with open("weather.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print("weather.json updated", out["updated"])
