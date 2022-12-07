import 'reflect-metadata'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { SessionData, State } from '@/middlewares/session'
import { UserModel } from '@/models/User'
import { phoneKeyboard, subscribeKeyboard } from './helpers/keyboards'
import { run } from '@grammyjs/runner'
import { session } from 'grammy'
import Context from '@/models/Context'
import addFile from './handlers/addFile'
import attachUser from '@/middlewares/attachUser'
import attachUserId from './middlewares/attachUserId'
import bot from '@/helpers/bot'
import checkSubscribe from './handlers/checkSubscribe'
import checkSubscribers from './handlers/checkSubsribers'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import sendFile from './handlers/sendFile'
import sendFirstVideo from './handlers/sendFirstVideo'
import sendSecondVideo from './handlers/sendSecondVideo'
import sequentialize, { getSessionKey } from '@/middlewares/sequentialize'
import start from './handlers/start'
import startMongo from '@/helpers/startMongo'
import notifyAllUsers from './handlers/notifyAllUsers'
import addPhoto from './handlers/addPhoto'

async function runApp() {
  console.log('Starting app...')
  // Mongo
  await startMongo()
  console.log('Mongo connected')

  // for deleting answers during tests
  // await AnswerModel.deleteMany()
  // await UserModel.deleteMany()
  // await PaymentModel.deleteMany()

  // Setup bot command
  // await bot.api.setMyCommands([
  //   {
  //     command: 'start',
  //     description: 'Запустить бота',
  //   },
  // ])
  // console.log('The bot commands are set')

  // Middlewares
  bot.use(sequentialize)
  bot.use(
    session({
      initial(): SessionData {
        return {
          userId: 0,
        }
      },
      getSessionKey,
    })
  )
  bot.use(ignoreOldMessageUpdates)
  bot.use(attachUser)
  bot.use(attachUserId)

  // Commands
  bot.command('start', start)
  bot.command('checktime228', (ctx: Context) => {
    const checkTime = setInterval(async () => {
      console.log('cheecktime')
      if (+new Date() >= +new Date(2022, 11, 8, 18, 30)) {
        await notifyAllUsers(ctx)
        clearInterval(checkTime)
      }
    }, 1000)
  })

  bot.callbackQuery('getFile', sendFile)

  bot.hears(['/addfile999'], addFile)

  bot.hears(['/addphoto999'], addPhoto)

  bot.on('my_chat_member', async (ctx: Context) => {
    //function on block bot
    if (ctx.update.my_chat_member?.new_chat_member)
      if (ctx.update.my_chat_member.new_chat_member.status === 'kicked') {
        console.log('nigger deactivated')
        ctx.dbuser.isActive = false
        await ctx.dbuser.save()
      }
  })

  bot.on('message', async (ctx: Context) => {
    if (ctx.session.state !== State.getPhone) return
    const message = ctx.message
    if (message?.contact) {
      const user = ctx.dbuser
      user.phone = message.contact.phone_number
      user.isRegistred = true
      await user.save()
      await ctx.reply(
        `Поздравляю с записью на мастер-класс!\nВстречаемся в четверг, 8 декабря, в 19:00 по мск.\nНе отключай уведомления, я вышлю напоминание и ссылку за 30 минут до начала вебинара.`
      )
      ctx.session.state = State.default
    } else {
      await ctx.reply('Отправьте номер телефона, нажмите на кнопку ниже 👇🏼', {
        reply_markup: {
          keyboard: phoneKeyboard.build(),
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      })
      return
    }
  })

  // bot.command('checksubs132', checkSubscribers)
  // bot.command('id', (ctx: Context) => {
  //   console.log(ctx.message.from)
  // })

  // // Callbacks
  // bot.callbackQuery('initiateSecond', async (ctx: Context) => {
  //   await ctx.reply(
  //     "Для того, чтобы получить второе видео, нужно быть подписанным на мой канал)\n\nПодпишитесь и нажмите кнопку 'Проверить подписку' ",
  //     { reply_markup: subscribeKeyboard }
  //   )
  // })

  // bot.callbackQuery('checkSub', async (ctx: Context) => {
  //   if (await checkSubscribe(ctx)) return await sendSecondVideo(ctx)
  //   await ctx.reply('Вы ещё не подписаны!')
  // })

  // bot.on('message', async (ctx: Context) => {
  //   if (ctx.session.state === State.getPhone) {
  //     const message = ctx.message
  //     if (message?.contact) {
  //       const user = ctx.dbuser
  //       console.log(message.contact.phone_number)
  //       user.phone = message.contact.phone_number
  //       await user.save()
  //       await sendFirstVideo(ctx)
  //     } else {
  //       await ctx.reply('Отправьте номер телефона, нажмите на кнопку ниже 👇🏼', {
  //         reply_markup: {
  //           keyboard: phoneKeyboard.build(),
  //           resize_keyboard: true,
  //           one_time_keyboard: true,
  //         },
  //       })
  //       return
  //     }
  //   }

  //   if (ctx.session.state === State.getName) {
  //     const user = ctx.dbuser
  //     if (!ctx.message?.text) await ctx.reply('Отправьте имя!')
  //     user.name = ctx.message.text
  //     ctx.session.state = State.getPhone
  //     await ctx.reply(
  //       'Теперь, для доступа к видео, отправьте номер телефона:',
  //       {
  //         reply_markup: {
  //           keyboard: phoneKeyboard.build(),
  //           resize_keyboard: true,
  //           one_time_keyboard: true,
  //         },
  //       }
  //     )
  //     await user.save()
  //   }
  // })

  // bot.on('pre_checkout_query', async (ctx: Context) => { //  ОПЛАТА ЧЕРЕЗ ТЕЛЕГРАМ ЕСЛИ НУЖНА ВКЛЮЧИТЬ
  //   console.log('Происходит оплата...')
  //   await ctx.answerPreCheckoutQuery(true)
  // }) // ответ на предварительный запрос по оплате

  // bot.on(':successful_payment', async (ctx: Context) => {
  //   await successfulPayment(ctx)
  // })

  // Errors
  bot.catch(console.error)
  // Start bot
  await bot.init()
  run(bot)

  console.info(`Bot ${bot.botInfo.username} is up and running`)
}

void runApp()
