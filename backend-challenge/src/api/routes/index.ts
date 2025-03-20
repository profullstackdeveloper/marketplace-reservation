import { Router } from 'express';
import { UserController } from '../controllers/User.controller';
import { UserService } from '@src/domain/services/User.service';
import { roleGuard } from '../middlewares/authenticate';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

const register = userController.register.bind(userController);
const getTracker = userController.getTrackerData.bind(userController);

router.post('/register', register);
router.get('/invite-code/:inviteCode', roleGuard, getTracker);

export default router;