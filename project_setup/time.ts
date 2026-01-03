let fakeDateCache: Date | null = null;
let enabled = false;

export async function enableTimeTravel(): Promise<void> {
  if (enabled) return;
  enabled = true;

  if (process.env.EXPO_PUBLIC_TIME_TRAVEL_ENABLED !== "true") return;

  console.log("🕰️  Time Toolbox (client) enabled");

  const success = await fetchFakeDate();
  if (success) {
    console.log("✅ Time travel applied in client environment");
    startAutoRefresh();
  } else {
    console.warn("⚠️  Time Toolbox unavailable, using real time fallback");
  }
}

async function fetchFakeDate(): Promise<boolean> {
  try {
    const url = process.env.EXPO_PUBLIC_TIME_TOOLBOX_URL;
    if (!url) throw new Error("TIME_TOOLBOX_URL not defined");

    const res = await fetch(url);
    const data = await res.json();
    if (data && data.combinedTimestamp) {
      fakeDateCache = new Date(data.combinedTimestamp);
      return true;
    }
  } catch (err) {
    console.warn("[Time Toolbox Client] Fetch failed:", err);
  }
  return false;
}

function startAutoRefresh() {
  // Auto-refresh fake date every 60 seconds
  setInterval(fetchFakeDate, 60 * 1000);
}

/**
 * Get the current time (fake date + live time)
 */
export function getCurrentTime(): Date {
  const now = new Date();

  if (!fakeDateCache) {
    return now;
  }

  // Merge fake date (Y-M-D) + real time (H:M:S)
  return new Date(
    fakeDateCache.getFullYear(),
    fakeDateCache.getMonth(),
    fakeDateCache.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds()
  );
}
