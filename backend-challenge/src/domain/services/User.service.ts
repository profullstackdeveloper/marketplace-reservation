import { Repository } from 'typeorm';
import { User } from '../models/User.entity';
import { dataSource } from '@src/infrastructure/database/db';
import { generateInviteCode } from '@src/common/utils';
import { TrackerDTO } from '@src/application/dtos';

const MAX_INV_USAGE = 10;
export class UserService {

    private userRepository: Repository<User>;
    constructor() { 
        this.userRepository = dataSource.getRepository(User)
    }

    async register(email: string, inviteCode?: string): Promise<User> {

        const existingUser = await this.userRepository.findOne({
            where: {
                email
            }
        });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        let referrer;

        if (inviteCode) {

            referrer = await this.userRepository.findOne({
                where: {
                    inviteCode
                }
            })


            if (!referrer) {
                throw new Error('Invalid invite code');
            }

            const inviteCount = await this.userRepository.count({
                where: {
                    referrerId: referrer.id
                }
            })

            if (inviteCount >= MAX_INV_USAGE) {
                throw new Error("Exceed limitation for this code.");
            }
        }

        const newUser = this.userRepository.create({
            email,
            referrerId: referrer?.id,
            inviteCode: generateInviteCode()
        });

        return await this.userRepository.save(newUser);
    }

    async tracker (inviteCode: string): Promise<TrackerDTO> {
        const referrer = await this.userRepository.findOne({
            where: {
                inviteCode
            }
        });

        if (!referrer) {
            return {}
        }

        const referrees = await this.userRepository.find({
            where: {
                referrerId: referrer?.id
            }
        });

        return {
            referrer,
            referrees
        }
    }
}
