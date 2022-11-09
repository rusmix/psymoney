import { UserModel } from '@/models/User'
import Context from '@/models/Context'
import fs = require('fs')

export default async function checkSubscribers(ctx: Context) {
  const users = await UserModel.find()
  const amountOfUsers = users.length
  let text = 'Users:\n'

  for (let i = 0; i < amountOfUsers; i++) {
    text += `${users[i].name} --- ${users[i].phone}\n`
  }

  fs.writeFileSync('users.txt', text, 'ascii')
  const textUsers = `Кол-во пользователей: ${amountOfUsers}\n\n`

  await ctx.replyWithDocument(__dirname + '/users.txt')
}
