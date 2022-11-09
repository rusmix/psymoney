import 'dotenv/config'
import ChannelJsonParser from '@/helpers/channelJsonParser'
import Context from '@/models/Context'

export default async function checkSubscribe(ctx: Context): Promise<boolean> {
  const channelJsonParser = new ChannelJsonParser(
    __dirname.split('/').slice(0, -2).join('/') + '/src/helpers/channels.json'
  )
  const channels = channelJsonParser.getAll()
  for (let i = 0; i < channels.length; i++) {
    const res = await ctx.api.getChatMember(channels[i], ctx.from.id)
    if (!res || res?.status === 'left') return false
    console.log(
      await ctx.api.getChatMember(
        channels[i], // process.env.CHANNEL_ID as unknown as number,
        ctx.from.id
      )
    )
  }
  return true
}
