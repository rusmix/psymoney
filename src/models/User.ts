import * as findorcreate from 'mongoose-findorcreate'
import {
  DocumentType,
  getModelForClass,
  plugin,
  prop,
} from '@typegoose/typegoose'
import { FindOrCreate } from '@typegoose/typegoose/lib/defaultClasses'

@plugin(findorcreate)
export class User extends FindOrCreate {
  @prop({ required: true, index: true, unique: true })
  id: number

  @prop({ index: true })
  username: string

  @prop({})
  phone: string

  @prop({})
  name: string

  @prop({ required: true, default: 'ru' })
  language: string

  //   public static async doSomething(this: DocumentType<User>, id: number) {
  //     this.id = id
  //     await this.save()
  //   }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})
