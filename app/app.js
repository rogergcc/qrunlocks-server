const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const TOKEN = process.env.BOT_TOKEN;

const App = express();
App.use(express.static(path.join(__dirname, "../public")));

const AttendaceRoute = require('./routes/attendance.routes')

const userController = require("./controllers/user.controller.js");

// App.use(express.static('public'))
App.use(express.json());
App.use(express.urlencoded({ extended: false }));



if (TOKEN === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}
const bot = new Telegraf(TOKEN);

bot.use(Telegraf.log());

App.use(cors());

const versionOne = (routeName) => `/api/v1/${routeName}`

App.get("/", (req, res, next) => {
  // console.log(req.body);

  res.send("INDEX ");
});

App.post("/webhooks/telegram", (req, res, next) => {
  console.log("webhooks/telegram: " + req.body);

  res.send({ status: "ok" });
});

// require("./routes/attendance.routes.js")(App);

App.use('/api/v1/attendance', AttendaceRoute);
// App.use('/user', User);
// App.use(versionOne('attendance'), AttendaceRoute)
App.post("/sendMessage", (req, res, next) => {
  console.log("sendMessage: " + req.body);
  const { chat_id, text } = req.body;

  // bot.telegram.sendMessage(ctx.chat.id, "Bienvenido al Bot POKEmons");
  bot.telegram.sendMessage(chat_id, "MSG local DEV " + text);
  res.send({ status: "enviado?" });
});

App.post("/verificar", (req, res, next) => {
  console.log("verificar: " + req.body);
  const { chat_id, text } = req.body;

  // bot.telegram.sendMessage(ctx.chat.id, "Bienvenido al Bot POKEmons");
  bot.telegram.sendMessage(chat_id, "MSG local DEV " + text);
  res.send({ status: "enviado?" });
});


bot.command("start", async (ctx) => {
  return await ctx.reply(
    "Register and attendance to Events",
    Markup.keyboard([
      ["🔍 Event Details", "🎫 Register Event"], // Row1 with 2 buttons
      ["🔑 My Qr", "📁 Source code"], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
  );
});

bot.hears("🔍 Event Details", (ctx) =>
  ctx.reply(
    "Detalles evento https://app.mural.co/t/blogteam1386/m/blogteam1386/1657604514012/38f154001e2cc9715e45b8d966951e203c771238?sender=u7f3fb39964fc58ef35d50069!"
  )
);
bot.hears("🎫 Register Event", (ctx) => registerUser(ctx));
// bot.hears('🔑 My Qr', ctx => ctx.reply('Qr de ! '+ctx.message.chat.id))
bot.hears("🔑 My Qr", (ctx) => getMyId(ctx));
// bot.hears('📞 Datos', ctx => ctx.reply('ver mis datoa!'))

bot.hears("📁 Source code", (ctx) => {
  ctx.reply("You can see code of this bot on GitHub. Thanks for stars!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🔗 GitHub",
            url: "https://github.com/rogergcc/qrunlocks-server",
          },
        ],
      ],
    },
  });
});

// try{
//   files = await fsPromises.readdir(commandsLocation);
// }catch(err){
//   console.log("Failed while commands are beign readed");
//   console.log(err);
//   return {};
// }
const registerUser = async (ctx)=>{
  const telegramId = ctx.message.chat.id;
  const userChat = ctx.message.chat
  const first_name = userChat.first_name+"".replace(/(['"])/g, "\\$1");
  const last_name = userChat.last_name+"".replace(/(['"])/g, "\\$1");
  const chat_id  =userChat.id

  console.log(first_name)

  try {
    const userControllerResponse = await userController.create({chat_id,first_name,last_name})
    // const user = await userService.create({chat_id,first_name,last_name})

    console.log('userCreate '+ userControllerResponse)
    ctx.reply(userControllerResponse.message)
  } catch (err) {
    console.error(`Error while creating User`, err.message);
    ctx.reply("Error while creating User")
  }
  
}
const getMyId = async (ctx) => {
  const telegramId = ctx.message.chat.id;
  console.log("get data")

  if (ctx.message.text.length > 900) {
    return ctx.reply(
      "Your text is too long. Please send text that contains not more than 900 symbols."
    );
  }
  // ctx.reply(telegramId)
  ctx.replyWithChatAction("upload_photo");

  axios
    .get(
      `http://api.qrserver.com/v1/create-qr-code/?data=${telegramId}&size=300x300`
    )
    .then(async (response) => {
      await ctx.replyWithPhoto(
        `http://api.qrserver.com/v1/create-qr-code/?data=${telegramId}&size=300x300`,
        { caption: "My Code for Event " }
      );
      // ctx.reply('You can send me another text or tap "⬅️ Back"');
    })
    .catch(async (err) => {
      console.log("catch error: " + err);
      await ctx.reply(
        "Data you sent isn`t valid. Please check that and try again."
      );
      ctx.reply('You can send me another text or tap "⬅️ Back"');

      sendError(
        `Generating error by message ${
          ctx.message.text
        }: \n\n ${err.toString()}`,
        ctx
      );
    });

  // return ctx.message.chat.id
};

function updateUser(ctx, active) {
  let jetzt = active ? "active" : "blocked";
  db.collection("allUsers").updateOne(
    { userId: ctx.from.id },
    { $set: { status: jetzt } },
    { upsert: true, new: true }
  );
}

function updateStat(action) {
  if (action == "button") {
    return db
      .collection("statistic")
      .updateOne(
        { genAct: action },
        { $inc: { count: 1 } },
        { new: true, upsert: true }
      );
  }

  db.collection("statistic").updateOne(
    { action: action },
    { $inc: { [makeDate()]: 1 } },
    { new: true, upsert: true }
  );
  db.collection("statistic").updateOne(
    { genAct: action },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );
}

// Login widget events
bot.on("connected_website", (ctx) => ctx.reply("Website connected"));

// bot.command('special', (ctx) => {
//   return ctx.reply(
//     'Special buttons keyboard',
//     Markup.keyboard([
//       Markup.button.contactRequest('Send contact'),
//       Markup.button.locationRequest('Send location')
//     ]).resize()
//   )
// })

bot.command("caption", (ctx) => {
  return ctx.replyWithPhoto(
    { url: "https://picsum.photos/200/300/?random" },
    {
      caption: "Caption",
      parse_mode: "Markdown",
      // ...Markup.inlineKeyboard([
      //   Markup.button.callback('Plain', 'plain'),
      //   Markup.button.callback('Italic', 'italic')
      // ])
    }
  );
});

bot.settings(async (ctx) => {
  await ctx.setMyCommands([
    {
      command: "/start",
      description: "Start Event Commands",
    },
  ]);
  return ctx.reply("Ok");
});

bot.help((ctx) => {
  ctx.reply("Send /start to receive a greeting");
  ctx.reply("Send /keyboard to receive a message with a keyboard");
  // ctx.reply('Send /quit to stop the bot');
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// error handler middleware
App.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({
    status: 500,
    message: err.message,
    body: {}
  });
})
module.exports = App;
