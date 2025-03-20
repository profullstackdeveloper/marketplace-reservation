import { Repository } from 'typeorm';
import { InviteCodeService } from './InviteCode.service';
import { User } from '../models/User';

export class UserService {

    constructor(
        private userRepository: Repository<User>,
        private inviteCodeService: InviteCodeService
    ){}

    async registerUser (email: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: {
            email
        } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const user = this.userRepository.create({
            email,
        });
        await this.userRepository.save(user);

        return user;
    }

    async registerUserWithInviteCode(email: string, inviteCode: string): Promise<User> {

        const existingUser = await this.userRepository.findOne({ where: {
            email
        } });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        const invite = await this.inviteCodeService.validateAndUseInviteCode(
            inviteCode
        );
        if (!invite) {
            throw new Error('Invalid or expired invite code');
        }

        const user = this.userRepository.create({
            email,
            inviteCode: invite,
        });

        await this.userRepository.save(user);
        return user;
    }
}
