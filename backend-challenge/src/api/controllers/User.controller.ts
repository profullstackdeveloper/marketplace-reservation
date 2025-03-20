import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { UserService } from '@src/domain/services/User.service';
import { Request, Response } from 'express';

export class UserController {

    constructor (private userService: UserService) {}

    async registerWithInviteCode(req: Request, res: Response) {
        try {
            const { email, inviteCode } = req.body;
            const user = await this.userService.registerUserWithInviteCode(email, inviteCode);
            res.status(201).json({
                message: 'Registration successful',
                userId: user.id,
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async register(req: Request, res: Response) {
        try {
            const {email} = req.body;
            const user = await this.userService.registerUser(email);
            res.status(HttpStatusCodes.CREATED).json(user);
        } catch (error) {
            res.status(400).json({error: error.message})
        }
    }
}
