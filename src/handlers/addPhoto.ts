import Context from '@/models/Context'
import { PhotoModel } from '@/models/Photo'

export function verifyPhoto(ctx: Context): string | undefined {
  if (ctx.message?.document) return

  if (ctx.message?.photo) return ctx.message.photo.slice(-1)[0].file_id
}

export default async function addPhoto(ctx: Context) {
  const id = verifyPhoto(ctx)
  if (id)
    await PhotoModel.findOrCreate({
      id,
    })
}
