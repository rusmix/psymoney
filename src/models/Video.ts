import * as findorcreate from 'mongoose-findorcreate'
import {
  DocumentType,
  getModelForClass,
  plugin,
  prop,
} from '@typegoose/typegoose'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'

@plugin(findorcreate)
export class Video extends FindOrCreate {
  @prop({ index: true, unique: true })
  id: string

  @prop({ index: true })
  number: number

  //   public static async doSomething(this: DocumentType<User>, id: number) {
  //     this.id = id
  //     await this.save()
  //   }
}

export const VideoModel = getModelForClass(Video, {
  schemaOptions: { timestamps: true },
})
