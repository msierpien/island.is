import { Field, ObjectType, ID } from '@nestjs/graphql'
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'
import { Role } from '../auth'
import { RecyclingPartnerModel } from '../recyclingPartner'

@ObjectType('AccessControl')
@Table({ tableName: 'access_control', timestamps: false })
export class AccessControlModel extends Model<AccessControlModel> {
  @Field((_) => ID)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    field: 'national_id',
  })
  nationalId!: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Field(() => Role)
  @Column({
    type: DataType.STRING,
  })
  role!: Role

  @Field()
  @Column({
    type: DataType.STRING,
    field: 'partner_id',
  })
  @ForeignKey(() => RecyclingPartnerModel)
  partnerId!: string

  @BelongsTo(() => RecyclingPartnerModel)
  recyclingPartner: RecyclingPartnerModel
}
