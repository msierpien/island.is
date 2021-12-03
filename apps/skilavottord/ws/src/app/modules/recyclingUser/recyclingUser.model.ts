import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

import { RecyclingRequestModel } from '../recyclingRequest'

@ObjectType()
@Table({ tableName: 'recycling_user' })
export class RecyclingUserModel extends Model<RecyclingUserModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  nationalId: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  role: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  partnerid: string

  @Field()
  @Column({
    type: DataType.BOOLEAN,
  })
  active: boolean

  @Field()
  @CreatedAt
  @Column
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column
  updatedAt: Date
}
