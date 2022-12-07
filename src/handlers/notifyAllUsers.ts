import { urlKeyboard } from '@/helpers/keyboards'
import Context from '@/models/Context'
import { UserModel } from '@/models/User'

export default async function notifyAllUsers(ctx: Context) {
  const users = await UserModel.find({ isActive: true, isRegistred: true })
  console.log('users', users)

  for (let i = 0; i < users.length; i++) {
    await ctx.api.sendMessage(
      users[i].id as string,
      'Через полчаса начнётся вебинар, держи ссылку👇🏻',
      { reply_markup: urlKeyboard }
    )
  }
}
