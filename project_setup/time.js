import axios from "axios";

// A flag so we only patch once
let patched = false;

// If time travel is enabled, hook the Date constructor globally
export async function enableTimeTravel() {
  if (patched || process.env.TIME_TRAVEL_ENABLED !== "true") return;
  patched = true;

  console.log("🕰️  Time Toolbox integration active");

  const fakeTime = await fetchFakeTimestamp();
  if (!fakeTime) {
    console.warn("⚠️  Failed to fetch fake time. Using real time fallback.");
    return;
  }

  // Patch global Date constructor
  const RealDate = Date;
  global.Date = class extends RealDate {
    constructor(...args) {
      if (args.length === 0) {
        // Return fake date + real time merged
        const now = new RealDate();
        const fake = new RealDate(fakeTime);
        return new RealDate(
          fake.getFullYear(),
          fake.getMonth(),
          fake.getDate(),
          now.getHours(),
          now.getMinutes(),
          now.getSeconds(),
          now.getMilliseconds()
        );
      }
      return new RealDate(...args);
    }

    static now() {
      return new RealDate().getTime();
    }
    static parse = RealDate.parse;
    static UTC = RealDate.UTC;
  };

  console.log("✅ Time travel applied globally");
}

async function fetchFakeTimestamp() {
  try {
    const res = await axios.get(process.env.TIME_TOOLBOX_URL);
    return res.data?.combinedTimestamp || null;
  } catch (err) {
    console.error("Time Toolbox fetch error:", err.message);
    return null;
  }
}
