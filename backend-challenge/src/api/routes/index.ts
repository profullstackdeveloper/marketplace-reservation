import { Router } from 'express';
import { InviteCodeController } from '../controllers/InviteCode.controller';
import { UserController } from '../controllers/User.controller';
import { authenticate } from '../middlewares/authenticate';
import { InviteCodeService } from '@src/domain/services/InviteCode.service';
import { User } from '@src/domain/models/User';
import { InviteCode } from '@src/domain/models/InviteCode';
import { UserService } from '@src/domain/services/User.service';
import { dataSource } from '@src/infrastructure/database/db';

const router = Router();

const inviteCodeRepo = dataSource.getRepository(InviteCode);
const userRepo = dataSource.getRepository(User);
const inviteCodeService = new InviteCodeService(inviteCodeRepo, userRepo);
const inviteCodeController = new InviteCodeController(inviteCodeService);
const userService = new UserService(userRepo, inviteCodeService);
const userController = new UserController(userService);

const createInviteCode = inviteCodeController.createInviteCode.bind(inviteCodeController);
const getInviteCodeDetails = inviteCodeController.getInviteCodeDetails.bind(inviteCodeController);
const register = userController.register.bind(userController);
const registerWithInviteCode = userController.registerWithInviteCode.bind(userController)

router.post(
  '/invite-codes',
  authenticate,
  createInviteCode
);

router.get(
  '/invite-codes/:code',
  authenticate,
  getInviteCodeDetails
);

router.post('/register', authenticate, register);
router.post('/register-with-invite-code', authenticate, registerWithInviteCode)

export default router;