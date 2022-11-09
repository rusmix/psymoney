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
import addVideo from './handlers/addVideo'
import attachUser from '@/middlewares/attachUser'
import attachUserId from './middlewares/attachUserId'
import bot from '@/helpers/bot'
import checkSubscribers from './handlers/checkSubsribers'
import ignoreOldMessageUpdates from '@/middlewares/ignoreOldMessageUpdates'
import sendFirstVideo from './handlers/sendFirstVideo'
import sequentialize, { getSessionKey } from '@/middlewares/sequentialize'
import start from './handlers/start'
import startMongo from '@/helpers/startMongo'
import checkSubscribe from './handlers/checkSubscribe'
import sendSecondVideo from './handlers/sendSecondVideo'

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
  bot.command('checksubs132', checkSubscribers)
  bot.command('id', (ctx: Context) => {
    console.log(ctx.message.from)
  })
  bot.hears(['/add1video999', '/add2video999'], addVideo)
  // Callbacks
  bot.callbackQuery('initiateSecond', async (ctx: Context) => {
    await ctx.reply(
      "Для того, чтобы получить второе видео, нужно быть подписанным на мой канал)\n\nПодпишитесь и нажмите кнопку 'Проверить подписку' ",
      { reply_markup: subscribeKeyboard }
    )
  })

  bot.callbackQuery('checkSub', async (ctx: Context) => {
    if (await checkSubscribe(ctx)) return await sendSecondVideo(ctx)
    await ctx.reply('Вы ещё не подписаны!')
  })

  bot.on('message', async (ctx: Context) => {
    if (ctx.session.state === State.getPhone) {
      const message = ctx.message
      if (message?.contact) {
        const user = ctx.dbuser
        console.log(message.contact.phone_number)
        user.phone = message.contact.phone_number
        await user.save()
        await sendFirstVideo(ctx)
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
    }

    if (ctx.session.state === State.getName) {
      const user = ctx.dbuser
      if (!ctx.message?.text) await ctx.reply('Отправьте имя!')
      user.name = ctx.message.text
      ctx.session.state = State.getPhone
      await ctx.reply(
        'Теперь, для доступа к видео, отправьте номер телефона:',
        {
          reply_markup: {
            keyboard: phoneKeyboard.build(),
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      )
      await user.save()
    }
  })

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
