const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const TOKEN = process.env.BOT_TOKEN


const HOST= process.env.HOST
const App = express();
const AttendaceRoute = require('./routes/attendance.routes')

const UserRoute = require('./routes/user.routes')
App.use(express.static(path.join(__dirname, "../public")));

// var corsOptions = {
//   origin: `http://localhost:8081${HOST}`
// };



App.use(cors())

// App.use(express.static('public'))
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

// parse requests of content-type - application/x-www-form-urlencoded
//App.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */



if (TOKEN === undefined) {
  throw new Error("BOT_TOKEN must be provided!");
}

const bot = new Telegraf(TOKEN);

bot.use(Telegraf.log());


const userController = require("./controllers/user.controller.js");


const versionOne = (routeName) => `/api/v1/${routeName}`

App.get("/", (req, res, next) => {
  // console.log(req.body);

  res.send("INDEX ");
});


App.get(versionOne(''), (req, res, next) => {
  // console.log(req.body);

  res.send("Index Api V1");

});

http://localhost:7002/api/v1/

App.post("/webhooks/telegram", (req, res, next) => {
  
  console.log("webhooks/telegram: " + JSON.stringify(req.body))

  res.send({ status: "ok" });
});

// require("./routes/attendance.routes.js")(App);
// require("./routes/user.routes.js")(App)

App.use('/api/v1/attendance', AttendaceRoute)
App.use('/api/v1/users', UserRoute)
// App.use('/user', User);
// App.use(versionOne('attendance'), AttendaceRoute)
App.post("/sendMessage", async (req, res, next) => {
  
  try {
    console.log("sendMessage(): " + JSON.stringify(req.body));

    const { chat_id, text } = req.body;

    // bot.telegram.sendMessage(ctx.chat.id, "Bienvenido al Bot POKEmons");
    const sendInfo = await bot.telegram.sendMessage(
      chat_id,
      "[DEV] sendMessage() " + text
    );

    res.send({ message: sendInfo });
    
  } catch (error) {
    console.log("sendMessage() error: "+JSON.stringify(error))
    res.status(400).send({ message: error.message });
  }
});

App.post("/verificar", (req, res, next) => {
  console.log("verificar: " + req.body);
  const { chat_id, text } = req.body;

  // bot.telegram.sendMessage(ctx.chat.id, "Bienvenido al Bot POKEmons");
  bot.telegram.sendMessage(chat_id, "MSG local DEV verificar" + text);
  res.send({ status: "verificar enviado verificado" });

});


bot.command("start", async (ctx) => {
  return await ctx.reply(
    "Register and attendance to Events",
    Markup.keyboard([
      ["🔍 Event Details", "🎫 Register Event"], // Row1 with 2 buttons
      ["🔑 My QR", "📁 Source code"], // Row2 with 2 buttons
    ])
      .oneTime()
      .resize()
  );
});

bot.hears("🔍 Event Details", (ctx) =>
  // ctx.reply( "And example of a Event Info" +
  //   "https://eventhasnodeplanetscale.netlify.app"
  // )

  ctx.reply("And example of a Event Info", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🔗 Event",
            url: "https://eventhasnodeplanetscale.netlify.app",
          },
        ],
      ],
    },
  })
);
bot.hears("🎫 Register Event", async(ctx) => await registerUser(ctx));
// bot.hears('🔑 My Qr', ctx => ctx.reply('Qr de ! '+ctx.message.chat.id))
bot.hears("🔑 My QR", async (ctx) => await getMyQrCode(ctx));
// bot.hears('📞 Datos', ctx => ctx.reply('ver mis datoa!'))

bot.hears("📁 Source code", (ctx) => {
  ctx.reply("@PlanetScale and @Hashnode hosting this hackathon \n You can see code of this bot on GitHub. Thanks for stars!", {
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

  try {
    const userControllerResponse = await userController.create({chat_id,first_name,last_name})
    // const user = await userService.create({chat_id,first_name,last_name})

    console.log('userControllerResponse '+ JSON.stringify(userControllerResponse))
    
    
    ctx.reply(userControllerResponse.message)
    if(userControllerResponse.affectedRows==true)
      await getMyQrCode(ctx)

  } catch (err) {
    console.error(`Error while creating User`, err.message);
    ctx.reply("Error while creating User")
  }
  
}
const getMyQrCode = async (ctx) => {
  const telegramId = ctx.message.chat.id;

  //let codeQrGenerate = {}
  const codeQrGenerate = JSON.stringify({userId:telegramId+""})
  // const codeQrGenerate = {userId:telegramId+""}

  const urlQrManage= "https://api.qrserver.com/v1/create-qr-code/?data="+codeQrGenerate+"&size=300x300"
  console.log("URL: "+ urlQrManage)
  if (ctx.message.text.length > 900) {
    return ctx.reply(
      "Your text is too long. Please send text that contains not more than 900 symbols."
    );
  }

  await ctx.replyWithPhoto(
    { url: urlQrManage },
    // urlQrManage+"",
    { caption: "Qr Id for Event" }
  );



  // return ctx.message.chat.id
};


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

async function start(token) {
  telegramBot = new TelegramBot(token);
  await telegramBot.startPolling({ restart: true });
}

async function stop() {
  if (telegramBot != null) {
    await telegramBot.stopPolling({ cancel: true });
    telegramBot = null;
  }
  process.exit();
}

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
