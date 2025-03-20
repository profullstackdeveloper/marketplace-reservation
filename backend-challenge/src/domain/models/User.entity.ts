import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { generateInviteCode } from '@src/common/utils';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true, nullable: false })
  inviteCode!: string;

  @Column({nullable: true})
  referrerId?: string;

  @CreateDateColumn()
  createdAt?: Date;
}
