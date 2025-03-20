import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { InviteCodeService } from '@src/domain/services/InviteCode.service';
import { Request, Response } from 'express';

export class InviteCodeController {

    constructor(private inviteCodeService: InviteCodeService) {}

    async createInviteCode(req: Request, res: Response) {
        try {
            const { maxUses, referrerId, expiresAt } = req.body;
            if (!referrerId) {
                res.status(HttpStatusCodes.BAD_REQUEST).json('referrer id is required!');
            } else {
                const code = await this.inviteCodeService.createInviteCode(
                    maxUses,
                    referrerId,
                    expiresAt
                );
                res.status(HttpStatusCodes.CREATED).json({ inviteCode: code });
            }
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    async getInviteCodeDetails(req: Request, res: Response) {
        try {
            const { code } = req.params;
            const invite = await this.inviteCodeService.getInviteCodeDetails(code);
            if (!invite) {
                res.status(404).json({ error: 'Invite code not found' });
            } else {
                res.status(HttpStatusCodes.OK).json({
                    inviteCode: code,
                    maxUses: invite.maxUses,
                    remainingUses: invite.remainingUses,
                    referrer: {
                        id: invite.referrer.id,
                        email: invite.referrer.email,
                    },
                    createdAt: invite.createdAt,
                    expiresAt: invite.expiresAt,
                });
            }

        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }
}