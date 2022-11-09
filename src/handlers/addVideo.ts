import { VideoModel } from '@/models/Video'
import Context from '@/models/Context'
import sendFirstVideo from './sendFirstVideo'

export default async function addVideo(ctx: Context) {
  let index = 0
  if (ctx.update.message.caption === '/add1video999') {
    index = 0
  }
  if (ctx.update.message.caption === '/add2video999') {
    index = 1
  }
  console.log(ctx.update.message, `index = ${index}`)
  const video = (
    await VideoModel.findOrCreate({
      number: index,
    })
  ).doc
  if (video) {
    video.number = index
    video.id = ctx.update.message.video.file_id
    await video.save()
  }

  await sendFirstVideo(ctx) // убрать отсюда
}
