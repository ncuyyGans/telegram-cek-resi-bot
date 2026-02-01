import axios from "axios";
import { formatTracking } from "./formatter.js";
import { COURIERS } from "./courier.js";

const API_KEY = process.env.BINDERBYTE_API_KEY;

async function track(courier, awb) {
  const url = "http://api.binderbyte.com/v1/track";
  const res = await axios.get(url, {
    params: {
      api_key: API_KEY,
      courier,
      awb
    },
    timeout: 15000
  });
  return res.data;
}

export async function autoTrack(awb) {
  for (const courier of COURIERS) {
    try {
      const r = await track(courier, awb);
      if (r.status === 200) {
        return r;
      }
    } catch {}
  }
  return null;
}

export async function handleResi(ctx) {
  const args = ctx.message.text.split(" ").slice(1);

  if (args.length === 0) {
    return ctx.reply("Format:\n/resi <awb>\n/resi <courier> <awb>");
  }

  // AUTO
  if (args.length === 1) {
    const awb = args[0];
    await ctx.reply(`🔍 Cek resi *${awb}* (auto)...`, { parse_mode: "Markdown" });

    const result = await autoTrack(awb);
    if (!result) return ctx.reply("❌ Resi tidak ditemukan.");

    return ctx.reply(
      formatTracking(result.data),
      { parse_mode: "Markdown" }
    );
  }

  // MANUAL
  const [courier, awb] = args;
  if (!COURIERS.includes(courier)) {
    return ctx.reply("❌ Courier tidak dikenal. Ketik /couriers");
  }

  try {
    const r = await track(courier, awb);
    if (r.status !== 200) return ctx.reply("❌ Resi tidak ditemukan.");
    return ctx.reply(
      formatTracking(r.data),
      { parse_mode: "Markdown" }
    );
  } catch {
    return ctx.reply("❌ Error saat cek resi.");
  }
}
