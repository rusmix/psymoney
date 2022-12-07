import { getFileKeyboard, phoneKeyboard } from '@/helpers/keyboards'
import { State } from '@/middlewares/session'
import Context from '@/models/Context'
import { FileModel } from '@/models/File'
import { PhotoModel } from '@/models/Photo'

export default async function start(ctx: Context) {
  const docs = await PhotoModel.find()
  const media = []
  for (let i = 0; i < docs.length; i++)
    media.push({
      type: 'photo',
      media: `${docs[i].id}`,
    })

  await ctx.replyWithMediaGroup(media)

  await ctx.reply(
    `Привет!

   Рады, что ты заберешь крутой инструмент, который помог уже 500 предпринимателям увеличить прибыль на 81% за 1 месяц.

   ЖМИ КНОПКУ и забирай себе Алгоритм работы с собой и сотрудником для получения точного результата и денег.`,
    { reply_markup: getFileKeyboard }
  )
  // ctx.session.state = State.getName
}
