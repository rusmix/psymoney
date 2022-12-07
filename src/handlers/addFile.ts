import { VideoModel } from '@/models/Video'
import Context from '@/models/Context'
import sendFirstVideo from './sendFirstVideo'
import { FileModel } from '@/models/File'
import sendFile from './sendFile'

export default async function addFile(ctx: Context) {
  let index = 0
  if (ctx.update.message.caption === '/addfile999') {
    index = 0
  }
  const file = (
    await FileModel.findOrCreate({
      number: index,
    })
  ).doc
  if (file) {
    file.number = index
    file.id = ctx.update.message.document.file_id
    await file.save()
  }

}
