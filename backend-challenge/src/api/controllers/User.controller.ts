import { TrackerDTO } from '@src/application/dtos';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { UserService } from '@src/domain/services/User.service';
import { Request, Response } from 'express';

export class UserController {

    constructor(private userService: UserService) { }

    async register(req: Request, res: Response) {
        try {
            const { email, inviteCode } = req.body;
            const user = await this.userService.register(email, inviteCode);
            res.status(HttpStatusCodes.CREATED).json({
                message: 'Registration successful',
                user
            });
        } catch (error) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ error: error.message });
        }
    }

    async getTrackerData(req: Request, res: Response) {
        try {
            const { inviteCode } = req.params;
            const result: TrackerDTO = await this.userService.tracker(inviteCode);

            res.status(HttpStatusCodes.OK).json(result);
        } catch (err) {
            res.status(HttpStatusCodes.BAD_REQUEST).json({ error: err.message })
        }
    }
}
