const { Telegraf, Markup } = require('telegraf')
const express = require("express");
const path = require("path");
// const cors = require("cors");

const TOKEN = process.env.BOT_TOKEN

const App = express();

App.use(express.static(path.join(__dirname, "../public")));
// App.use(express.static('public'))
App.use(express.json());
App.use(express.urlencoded({ extended: false }));


if (TOKEN === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const bot = new Telegraf(TOKEN)

bot.use(Telegraf.log())

bot.command('onetime', (ctx) =>
  ctx.reply('One time keyboard', Markup
    .keyboard(['/simple', '/inline', '/pyramid'])
    .oneTime()
    .resize()
  )
)

App.get("/", (req, res, next) => {
  // console.log(req.body);

  res.send("INDEX LOCAL");
});

App.post("/webhooks/telegram", (req, res, next) => {
  console.log(req.body);

  res.send({ status: "ok" });
});

App.post("/sendMessage", (req, res, next) => {
  console.log(req.body);
  const {chat_id,text}= req.body
  

  // bot.telegram.sendMessage(ctx.chat.id, "Bienvenido al Bot POKEmons");  
  bot.telegram.sendMessage(chat_id,"MSG local DEV "+text)
  res.send({ status: "enviado?" });
});


bot.command('custom', async (ctx) => {
  return await ctx.reply('Custom buttons keyboard', Markup
    .keyboard([
      ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
      ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
      ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
  )
})

bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

bot.command('special', (ctx) => {
  return ctx.reply(
    'Special buttons keyboard',
    Markup.keyboard([
      Markup.button.contactRequest('Send contact'),
      Markup.button.locationRequest('Send location')
    ]).resize()
  )
})


bot.command('simple', (ctx) => {
  return ctx.replyWithHTML(
    '<b>Coke</b> or <i>Pepsi?</i>',
    Markup.keyboard(['Coke', 'Pepsi'])
  )
})

bot.command('inline', (ctx) => {
  return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard([
      Markup.button.callback('Coke', 'Coke'),
      Markup.button.callback('Pepsi', 'Pepsi')
    ])
  })
})


bot.command('caption', (ctx) => {
  return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
    {
      caption: 'Caption',
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([
        Markup.button.callback('Plain', 'plain'),
        Markup.button.callback('Italic', 'italic')
      ])
    }
  )
})


bot.action(/.+/, (ctx) => {
  return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = App;