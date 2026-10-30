const db = require("./app/models");

async function run() {
  await db.notifications.bulkCreate([
    {
      title: "Tizim ishga tushirildi",
      message: "City Lighting Pro monitoring tizimi muvaffaqiyatli ishga tushdi.",
      type: "success",
      cityId: 1,
      isRead: false
    },
    {
      title: "Smart Hisoblagich ulandi",
      message: "Qurilma-01 smart elektr hisoblagich bilan RS-485 aloqa o'rnatildi.",
      type: "info",
      deviceId: 1,
      cityId: 1,
      isRead: false
    },
    {
      title: "B liniyada yuqori yuklanish",
      message: "B liniyada tok kuchi 14.1A ga yetdi, me'yoriy oraliqda.",
      type: "warn",
      deviceId: 1,
      cityId: 1,
      isRead: false
    },
    {
      title: "A liniya avtomatik yoqildi",
      message: "Astronomik quyosh botishi jadvali asosida A liniya yoqildi.",
      type: "info",
      deviceId: 1,
      cityId: 1,
      isRead: true
    }
  ]);

  await db.device_history.bulkCreate([
    {
      deviceId: 1,
      eventType: "METER_READ",
      voltage_a: 224.5,
      voltage_b: 226.0,
      voltage_c: 223.8,
      current_a: 12.4,
      current_b: 14.1,
      current_c: 11.8,
      active_power: 8.5,
      energy_kwh: 1240.5,
      power_factor: 0.96,
      frequency: 50.0,
      status: true,
      switch1: true,
      switch2: true,
      switch3: true,
      details: "Doimiy telemetriya o'lchovi"
    },
    {
      deviceId: 1,
      eventType: "RELAY_TOGGLE",
      voltage_a: 225.1,
      voltage_b: 226.4,
      voltage_c: 224.0,
      current_a: 11.9,
      current_b: 13.8,
      current_c: 11.2,
      active_power: 8.1,
      energy_kwh: 1238.2,
      power_factor: 0.95,
      frequency: 50.0,
      status: true,
      switch1: true,
      switch2: true,
      switch3: false,
      details: "C liniya qo'lda o'chirildi"
    },
    {
      deviceId: 1,
      eventType: "STATUS_CHANGE",
      voltage_a: 223.9,
      voltage_b: 225.0,
      voltage_c: 223.1,
      current_a: 0.1,
      current_b: 0.1,
      current_c: 0.1,
      active_power: 0.05,
      energy_kwh: 1235.0,
      power_factor: 0.90,
      frequency: 50.0,
      status: true,
      switch1: false,
      switch2: false,
      switch3: false,
      details: "Qurilma tarmoqqa ulandi"
    }
  ]);

  console.log("Seed extra done");
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
