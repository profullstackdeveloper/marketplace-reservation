import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class InviteCode {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ unique: true })
    codeHash!: string;

    @Column()
    maxUses?: number;

    @Column()
    remainingUses!: number;

    @ManyToOne(() => User, (user) => user.id)
    referrer!: User;

    @OneToMany(() => User, (user) => user.inviteCode)
    users?: User[];

    @CreateDateColumn()
    createdAt!: Date;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt!: Date;
}
