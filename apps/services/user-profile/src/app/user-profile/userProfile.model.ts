import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { Locale } from './types/localeTypes'

@Table({
  tableName: 'user_profile',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class UserProfile extends Model<UserProfile> {
  // Force rebuild of schemas
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  @ApiProperty()
  nationalId!: string

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  mobilePhoneNumber?: string

  @Column({
    type: DataType.ENUM('en', 'is'),
  })
  @ApiProperty({
    description: 'User selected locale',
    enum: Locale,
  })
  locale?: Locale

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  email?: string

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  emailVerified?: boolean

  @Column({
    type: DataType.BOOLEAN,
  })
  @ApiProperty()
  mobilePhoneNumberVerified?: boolean

  @Column({
    type: DataType.STRING,
  })
  @ApiProperty()
  profileImageUrl?: string

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  @ApiProperty()
  documentNotifications!: boolean
}
