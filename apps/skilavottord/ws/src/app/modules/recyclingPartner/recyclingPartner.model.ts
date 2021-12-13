import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript'

import { RecyclingRequestModel } from '../recyclingRequest'

@ObjectType('RecyclingPartner')
@Table({ tableName: 'recycling_partner' })
export class RecyclingPartnerModel extends Model<RecyclingPartnerModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  companyId: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  address: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  postnumber: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  city: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  website: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  phone: string

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

  @Field(() => [RecyclingRequestModel])
  @HasMany(() => RecyclingRequestModel)
  recyclingRequests?: typeof RecyclingRequestModel[]
}
