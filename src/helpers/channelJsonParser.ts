// import 'fs'
import fs = require('fs')

export default class ChannelJsonParser {
  private data: { channels: string[] }

  constructor(private readonly filePath: string) {
    this.data = JSON.parse(fs.readFileSync(filePath).toString())
  }

  public getAll(): string[] {
    return this.data.channels
  }

  public add(channelId: string): void {
    this.data.channels.push(channelId)
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
  }
}
