import { NextFunction } from 'grammy'
import { UserModel } from '@/models/User'
import Context from '@/models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
  const { doc } = await UserModel.findOrCreate({ id: ctx.from.id }) //функция для прикрепления к ctx dbuser
  ctx.dbuser = doc

  if (!ctx.dbuser?.username && ctx.from?.username) {
    ctx.dbuser.username = ctx.from.username
    await ctx.dbuser.save()
  }

  if (!ctx.dbuser?.username && !ctx.from?.username) {
    ctx.dbuser.username = 'unknown'
    await ctx.dbuser.save()
  }
  return next()
}
