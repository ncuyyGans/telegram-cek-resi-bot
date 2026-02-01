import express from "express";
import { Telegraf } from "telegraf";
import { handleResi } from "./bot.js";
import { COURIERS } from "./courier.js";

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
const PORT = process.env.PORT || 3000;

bot.start((ctx) =>
  ctx.reply(
`🤖 Bot Cek Resi
/resi <awb>
/resi <courier> <awb>
/couriers`
  )
);

bot.command("couriers", (ctx) =>
  ctx.reply("📦 Courier tersedia:\n" + COURIERS.join(", "))
);

bot.command("resi", handleResi);

app.get("/", (_, res) => res.send("OK"));
app.use(bot.webhookCallback("/telegraf"));

app.listen(PORT, async () => {
  if (process.env.WEBHOOK_URL) {
    await bot.telegram.setWebhook(
      `${process.env.WEBHOOK_URL}/telegraf`
    );
  } else {
    bot.launch();
  }
  console.log("Bot running");
});
