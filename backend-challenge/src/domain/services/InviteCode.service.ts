import { Repository } from 'typeorm';
import { InviteCode } from '../models/InviteCode';
import { generateInviteCode, hashInviteCode } from '@src/common/codeUtils';
import { User } from '../models/User';

export class InviteCodeService {

    constructor(
        private inviteCodeRepository: Repository<InviteCode>,
        private userRepository: Repository<User>
    ) {}

    async createInviteCode(
        maxUses: number,
        referrerId: string,
        expiresAt?: Date
    ): Promise<string> {
        console.log('maxUses: ', maxUses)
        if (maxUses <= 0) {
            throw new Error('maxUses must be a positive number');
        }

        const referrer = await this.userRepository.findOne({
            where: { id: referrerId }
        });

        if (!referrer) {
            throw new Error('Referrer not found');
        }

        let code: string;
        let codeHash: string;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
            code = generateInviteCode();
            codeHash = await hashInviteCode(code);

            const existing = await this.inviteCodeRepository.findOne({
                where: { codeHash }
            });

            if (!existing) {
                const inviteCode = this.inviteCodeRepository.create({
                    codeHash,
                    maxUses,
                    remainingUses: maxUses,
                    referrer,
                    expiresAt,
                });

                await this.inviteCodeRepository.save(inviteCode);
                return code;
            }

            attempts++;
        }

        throw new Error('Failed to generate a unique invite code');

    }

    async validateAndUseInviteCode(
        code: string
    ): Promise<InviteCode | null> {
        const codeHash = await hashInviteCode(code);
        const inviteCode = await this.inviteCodeRepository.findOne({
            where: { codeHash },
            relations: ['referrer'],
        });

        if (
            !inviteCode ||
            inviteCode.remainingUses <= 0 ||
            (inviteCode.expiresAt && inviteCode.expiresAt < new Date())
        ) {
            return null;
        }

        const result = await this.inviteCodeRepository
            .createQueryBuilder()
            .update(InviteCode)
            .set({ remainingUses: () => '"remainingUses" - 1' })
            .where('id = :id AND remainingUses > 0', { id: inviteCode.id })
            .returning('*')
            .execute();

        if (result.affected && result.affected > 0) {
            return result.raw[0];
        }

        return null;
    }

    async getInviteCodeDetails(code: string): Promise<InviteCode | null> {
        const codeHash = await hashInviteCode(code);
        return this.inviteCodeRepository.findOne({
            where: { codeHash },
            relations: ['referrer'],
        });
    }
}
