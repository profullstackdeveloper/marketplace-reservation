import { UserService } from '../../domain/services/User.service';
import { InviteCodeService } from '../../domain/services/InviteCode.service';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { User } from '../../domain/models/User';

describe('UserService', () => {
  const mockUserRepo = mockDeep<Repository<User>>();
  const mockInviteCodeService = mockDeep<InviteCodeService>();
  let userService: UserService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    createdAt: new Date()
  };

  const mockInviteCode = {
    id: '1',
    codeHash: 'hashedABCD1234',
    maxUses: 1,
    remainingUses: 1,
    referrer: mockUser,
    users: [],
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(mockUserRepo, mockInviteCodeService);
  });

  describe('registerUser', () => {
    it('should register user successfully', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await userService.registerUser('test@example.com');
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        email: 'test@example.com'
      });
    });

    it('should throw error for existing email', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      await expect(userService.registerUser('test@example.com'))
        .rejects
        .toThrow('Email already registered');
    });
  });

  describe('registerUserWithInviteCode', () => {
    it('should register user with invite code successfully', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockInviteCodeService.validateAndUseInviteCode.mockResolvedValue(mockInviteCode);
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await userService.registerUserWithInviteCode('test@example.com', 'ABCD-1234');
      expect(result).toEqual(mockUser);
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        email: 'test@example.com',
        inviteCode: mockInviteCode
      });
    });

    it('should throw error for existing email', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      await expect(userService.registerUserWithInviteCode('test@example.com', 'ABCD-1234'))
        .rejects
        .toThrow('Email already registered');
    });

    it('should throw error for invalid invite code', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockInviteCodeService.validateAndUseInviteCode.mockResolvedValue(null);

      await expect(userService.registerUserWithInviteCode('test@example.com', 'INVALID'))
        .rejects
        .toThrow('Invalid or expired invite code');
    });
  });
});
