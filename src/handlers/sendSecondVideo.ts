import { VideoModel } from '@/models/Video'
import { adKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'

export default async function sendSecondVideo(ctx: Context) {
  const videoId = (await VideoModel.findOne({ number: 1 })).id as string
  await ctx.replyWithVideo(videoId, {
    caption: 'Спасибо за подписку, приятного просмотра!',
  })
}
