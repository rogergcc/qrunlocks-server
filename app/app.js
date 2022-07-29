const { Telegraf, Markup } = require('telegraf')
const express = require("express");
const path = require("path");
// const cors = require("cors");
const axios = require('axios')
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

App.post("/verificar", (req, res, next) => {
  console.log(req.body);
  const {chat_id,text}= req.body
  

  // bot.telegram.sendMessage(ctx.chat.id, "Bienvenido al Bot POKEmons");  
  bot.telegram.sendMessage(chat_id,"MSG local DEV "+text)
  res.send({ status: "enviado?" });
});
//😎🎟🎫✒🖋 
bot.command('start', async (ctx) => {
  return await ctx.reply('Register and attendance to Events', Markup
    .keyboard([
      ['🔍 Event Details', '🎫 Register Event'], // Row1 with 2 buttons
      ['🔑 My Qr', '📁 Source code'], // Row2 with 2 buttons
    ])
    .oneTime()
    .resize()
  )
})

bot.hears('🔍 Event Details', ctx => ctx.reply('Detalles evento https://app.mural.co/t/blogteam1386/m/blogteam1386/1657604514012/38f154001e2cc9715e45b8d966951e203c771238?sender=u7f3fb39964fc58ef35d50069!'))
bot.hears('🎫 Register Event', ctx => ctx.reply('Se registro al evento'))
// bot.hears('🔑 My Qr', ctx => ctx.reply('Qr de ! '+ctx.message.chat.id))
bot.hears('🔑 My Qr', ctx => getMyId(ctx))
// bot.hears('📞 Datos', ctx => ctx.reply('ver mis datoa!'))

bot.hears('📁 Source code', (ctx) => {
  ctx.reply(
    'You can see code of this bot on GitHub. Thanks for stars!', 
    { reply_markup: { inline_keyboard: [[{text: '🔗 GitHub', url: 'https://github.com/rogergcc/qrunlocks-server'}]] } }
  )
})

// bot.on('text', async (ctx) => {
//   if (ctx.message.text.length > 900) {
//     return ctx.reply('Your text is too long. Please send text that contains not more than 900 symbols.')
//   }

//   ctx.replyWithChatAction('upload_photo')

//   axios.get(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.text)}&size=300x300`)
//     .then(async (response) => {
//       await ctx.replyWithPhoto(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.text)}&size=300x300`, { caption: 'Generated via @OneQRBot' })
//       ctx.reply('You can send me another text or tap "⬅️ Back"')
    
//       updateStat('generating')
//       updateUser(ctx, true)
//     })
//     .catch(async (err) => {
//       console.log(err)
//       await ctx.reply('Data you sent isn`t valid. Please check that and try again.')
//       ctx.reply('You can send me another text or tap "⬅️ Back"')

//       sendError(`Generating error by message ${ctx.message.text}: \n\n ${err.toString()}`, ctx)
//     })  
// })

const getMyId = async(ctx)=>{
  const telegramId = ctx.message.chat.id
  if (ctx.message.text.length > 900) {
    return ctx.reply('Your text is too long. Please send text that contains not more than 900 symbols.')
  }
  // ctx.reply(telegramId)
  ctx.replyWithChatAction('upload_photo')

  axios.get(`http://api.qrserver.com/v1/create-qr-code/?data=${telegramId}&size=300x300`)
    .then(async (response) => {
      await ctx.replyWithPhoto(`http://api.qrserver.com/v1/create-qr-code/?data=${telegramId}&size=300x300`, { caption: 'My Code for Event ' })
      ctx.reply('You can send me another text or tap "⬅️ Back"')
    
  
    })
    .catch(async (err) => {
      console.log(err)
      await ctx.reply('Data you sent isn`t valid. Please check that and try again.')
      ctx.reply('You can send me another text or tap "⬅️ Back"')

      sendError(`Generating error by message ${ctx.message.text}: \n\n ${err.toString()}`, ctx)
    })  

  // return ctx.message.chat.id


}

function updateUser (ctx, active) {
  let jetzt = active ? 'active' : 'blocked'
  db.collection('allUsers').updateOne({userId: ctx.from.id}, {$set: {status: jetzt}}, {upsert: true, new: true})
}

function updateStat (action) {
  if (action == 'button') {
    return db.collection('statistic').updateOne({genAct: action}, {$inc: {count: 1}}, {new: true, upsert: true})
  }

  db.collection('statistic').updateOne({action: action}, {$inc: {[makeDate()]: 1}}, {new: true, upsert: true})
  db.collection('statistic').updateOne({genAct: action}, {$inc: {count: 1}}, {new: true, upsert: true})
}

// Login widget events
bot.on('connected_website', (ctx) => ctx.reply('Website connected'))

// bot.command('special', (ctx) => {
//   return ctx.reply(
//     'Special buttons keyboard',
//     Markup.keyboard([
//       Markup.button.contactRequest('Send contact'),
//       Markup.button.locationRequest('Send location')
//     ]).resize()
//   )
// })




bot.command('caption', (ctx) => {
  return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
    {
      caption: 'Caption',
      parse_mode: 'Markdown',
      // ...Markup.inlineKeyboard([
      //   Markup.button.callback('Plain', 'plain'),
      //   Markup.button.callback('Italic', 'italic')
      // ])
    }
  )
})

bot.settings(async (ctx) => {
  await ctx.setMyCommands([
    {
      command: '/start',
      description: 'Start Event Commands'
    }
    
  ])
  return ctx.reply('Ok')
})




bot.help((ctx) => {
  ctx.reply('Send /start to receive a greeting');
  ctx.reply('Send /keyboard to receive a message with a keyboard');
  // ctx.reply('Send /quit to stop the bot');
});



bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = App;