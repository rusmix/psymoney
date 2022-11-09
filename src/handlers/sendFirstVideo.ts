import { VideoModel } from '@/models/Video'
import { adKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'

export default async function sendFirstVideo(ctx: Context) {
  const videoId = (await VideoModel.findOne({ number: 0 })).id as string
  await ctx.replyWithVideo(videoId, {
    caption: 'Хотите получить ещё одно полезное видео? Нажмите на кнопку 👇🏻 ',
    reply_markup: adKeyboard,
  })
}
