import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const DATA_FILE = path.join(process.cwd(), "fake_times.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) return {};
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 🧭 API: Get current fake timestamp
app.get("/api/fake-time", (req, res) => {
  const key = (req.query.key || '').trim();
  if (!key) return res.status(400).json({ error: "Missing key" });

  const data = readData();
  const fakeDate = data[key]; // e.g., "2026-06-15"

  const now = new Date();
  const time = now.toTimeString().split(" ")[0]; // current time (hh:mm:ss)
  const combinedTimestamp = fakeDate
    ? `${fakeDate}T${time}Z`
    : now.toISOString();

  res.json({
    fakeDate: fakeDate || null,
    currentTime: time,
    combinedTimestamp,
  });
});

// 🧭 API: Set fake date
app.post("/api/fake-time", (req, res) => {
  const key = (req.body.key || '').trim();
const fakeDate = (req.body.fakeDate || '').trim();
  if (!key || !fakeDate)
    return res.status(400).json({ error: "Missing key or fakeDate" });

  const data = readData();
  data[key] = fakeDate;
  writeData(data);

  res.json({ success: true, key, fakeDate });
});

// 🧭 API: Reset fake date
app.post("/api/reset-time", (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ error: "Missing key" });

  const data = readData();
  delete data[key];
  writeData(data);

  res.json({ success: true, message: `Fake date cleared for ${key}` });
});

// Serve UI
app.use(express.static("public"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🧰 Time Toolbox running on port ${PORT}`));
