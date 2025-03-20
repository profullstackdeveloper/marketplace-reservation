import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { InviteCode } from './InviteCode';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @ManyToOne(() => InviteCode, (inviteCode) => inviteCode.users)
  inviteCode?: InviteCode;

  @CreateDateColumn()
  createdAt?: Date;
}
