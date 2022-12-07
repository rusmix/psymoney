import { VideoModel } from '@/models/Video'
import { adKeyboard, phoneKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import { FileModel } from '@/models/File'
import { State } from '@/middlewares/session'

export default async function sendFile(ctx: Context) {
  await ctx.editMessageReplyMarkup()
  const fileId = (await FileModel.findOne({ number: 0 })).id as string
  await ctx.replyWithDocument(fileId)
  setTimeout(async () => {
    await ctx.reply(
      `Чтобы зарегестрироваться на вебинар, нажми на кнопку поделиться контактом👇🏻`,
      {
        reply_markup: {
          keyboard: phoneKeyboard.build(),
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    )
    ctx.session.state = State.getPhone
  }, 1000 * 10)
}
