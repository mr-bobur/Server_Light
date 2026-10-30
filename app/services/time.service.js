const db = require("../models");
const SystemTime = db.system_time;

// In-memory cache for fast zero-latency access
let cachedConfig = {
  id: 1,
  mode: "AUTO",
  offset_seconds: 0,
  manual_datetime: null,
  manual_set_at: null,
  sync_interval_seconds: 3600,
  timezone: "Asia/Tashkent",
  updated_by: "system"
};

let isInitialized = false;

async function init() {
  if (isInitialized) return;
  try {
    if (!SystemTime) {
      console.warn("[TimeService] SystemTime model not yet loaded.");
      return;
    }
    await SystemTime.sync();
    let row = await SystemTime.findByPk(1);
    if (!row) {
      row = await SystemTime.create({
        id: 1,
        mode: "AUTO",
        offset_seconds: 0,
        manual_datetime: null,
        manual_set_at: null,
        sync_interval_seconds: 3600,
        timezone: "Asia/Tashkent",
        updated_by: "system"
      });
      console.log("[TimeService] Created default system_time row (AUTO mode).");
    }
    cachedConfig = {
      id: row.id,
      mode: row.mode || "AUTO",
      offset_seconds: Number(row.offset_seconds) || 0,
      manual_datetime: row.manual_datetime,
      manual_set_at: row.manual_set_at,
      sync_interval_seconds: Number(row.sync_interval_seconds) || 3600,
      timezone: row.timezone || "Asia/Tashkent",
      updated_by: row.updated_by || "system"
    };
    isInitialized = true;
    console.log(`[TimeService] Initialized. Mode: ${cachedConfig.mode}, Offset: ${cachedConfig.offset_seconds}s`);
  } catch (err) {
    console.error("[TimeService] Init error (using in-memory fallback):", err.message);
  }
}

function getEffectiveTime() {
  const now = new Date();
  const offsetMs = (cachedConfig.mode === "MANUAL" && typeof cachedConfig.offset_seconds === "number")
    ? cachedConfig.offset_seconds * 1000
    : 0;
  const effective = new Date(now.getTime() + offsetMs);

  const y = effective.getFullYear();
  const m = effective.getMonth(); // 0-11 for JS / firmware compatibility
  const month = effective.getMonth() + 1; // 1-12 human readable
  const d = effective.getDate();
  const hh = effective.getHours();
  const mm = effective.getMinutes();
  const ss = effective.getSeconds();

  const pad = (n) => String(n).padStart(2, "0");
  const formatted = `${y}-${pad(month)}-${pad(d)} ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  const dateFormatted = `${y}-${pad(month)}-${pad(d)}`;
  const timeFormatted = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;

  return {
    y,
    m,
    month,
    d,
    hh,
    mm,
    ss,
    iso: effective.toISOString(),
    timestamp: effective.getTime(),
    formatted,
    dateFormatted,
    timeFormatted,
    mode: cachedConfig.mode,
    offsetSeconds: cachedConfig.offset_seconds,
    isManual: cachedConfig.mode === "MANUAL",
    timezone: cachedConfig.timezone,
    updatedBy: cachedConfig.updated_by
  };
}

async function setSystemTime({ mode = "AUTO", targetDateTime = null, offsetSeconds = null, updatedBy = "user" }) {
  await init();

  let finalMode = mode === "MANUAL" ? "MANUAL" : "AUTO";
  let finalOffset = 0;
  let manualDate = null;
  const now = new Date();

  if (finalMode === "MANUAL") {
    if (targetDateTime) {
      const parsed = new Date(targetDateTime);
      if (isNaN(parsed.getTime())) {
        throw new Error("Noto'g'ri sana va vaqt formati kiritildi.");
      }
      manualDate = parsed;
      finalOffset = Math.round((parsed.getTime() - now.getTime()) / 1000);
    } else if (typeof offsetSeconds === "number") {
      finalOffset = Math.round(offsetSeconds);
      manualDate = new Date(now.getTime() + finalOffset * 1000);
    } else {
      // Default manual to current time with 0 offset
      finalOffset = 0;
      manualDate = now;
    }
  }

  cachedConfig.mode = finalMode;
  cachedConfig.offset_seconds = finalOffset;
  cachedConfig.manual_datetime = manualDate;
  cachedConfig.manual_set_at = now;
  cachedConfig.updated_by = updatedBy;

  try {
    let row = await SystemTime.findByPk(1);
    if (row) {
      await row.update({
        mode: finalMode,
        offset_seconds: finalOffset,
        manual_datetime: manualDate,
        manual_set_at: now,
        updated_by: updatedBy
      });
    } else {
      await SystemTime.create({
        id: 1,
        mode: finalMode,
        offset_seconds: finalOffset,
        manual_datetime: manualDate,
        manual_set_at: now,
        updated_by: updatedBy
      });
    }
    console.log(`[TimeService] Time updated: Mode=${finalMode}, Offset=${finalOffset}s by ${updatedBy}`);
  } catch (err) {
    console.error("[TimeService] DB Save error:", err.message);
  }

  return getEffectiveTime();
}

async function resetToAuto(updatedBy = "user") {
  return await setSystemTime({ mode: "AUTO", updatedBy });
}

function getConfig() {
  return { ...cachedConfig };
}

// Auto init in background
setTimeout(() => {
  init().catch(() => {});
}, 500);

module.exports = {
  init,
  getEffectiveTime,
  setSystemTime,
  resetToAuto,
  getConfig
};
