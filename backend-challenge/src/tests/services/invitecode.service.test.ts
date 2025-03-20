import { InviteCodeService } from '../../domain/services/InviteCode.service';
import { mockDeep } from 'jest-mock-extended';
import { Repository } from 'typeorm';
import { InviteCode } from '../../domain/models/InviteCode';
import { User } from '../../domain/models/User';

describe('InviteCodeService', () => {
    const mockInviteCodeRepo = mockDeep<Repository<InviteCode>>();
    const mockUserRepo = mockDeep<Repository<User>>();
    let inviteCodeService: InviteCodeService;

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
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) // 24 hours from now
    };

    beforeEach(() => {
        jest.clearAllMocks();
        inviteCodeService = new InviteCodeService(mockInviteCodeRepo, mockUserRepo);
    });

    describe('createInviteCode', () => {
        it('should create an invite code successfully', async () => {
            mockUserRepo.findOne.mockResolvedValue(mockUser);
            mockInviteCodeRepo.findOne.mockResolvedValue(null);
            mockInviteCodeRepo.create.mockReturnValue(mockInviteCode);
            mockInviteCodeRepo.save.mockResolvedValue(mockInviteCode);

            const result = await inviteCodeService.createInviteCode(1, '1');
            expect(mockUserRepo.findOne).toHaveBeenCalledWith({
                where: { id: '1' }
            });
        });

        it('should throw error for invalid maxUses', async () => {
            await expect(inviteCodeService.createInviteCode(0, '1'))
                .rejects
                .toThrow('maxUses must be a positive number');
        });

        it('should throw error for non-existent referrer', async () => {
            mockUserRepo.findOne.mockResolvedValue(null);
            await expect(inviteCodeService.createInviteCode(1, '1'))
                .rejects
                .toThrow('Referrer not found');
        });
    });

    describe('validateAndUseInviteCode', () => {
        it('should validate and use invite code successfully', async () => {
            mockInviteCodeRepo.findOne.mockResolvedValue(mockInviteCode);
            mockInviteCodeRepo.createQueryBuilder.mockReturnValue({
                update: jest.fn().mockReturnThis(),
                set: jest.fn().mockReturnThis(),
                where: jest.fn().mockReturnThis(),
                returning: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    affected: 1,
                    raw: [mockInviteCode]
                })
            } as any);

            const result = await inviteCodeService.validateAndUseInviteCode('ABCD-1234');
            expect(result).toBeDefined();
            expect(result?.remainingUses).toBe(1);
        });

        it('should return null for expired invite code', async () => {
            const expiredCode = {
                ...mockInviteCode,
                expiresAt: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
            };
            mockInviteCodeRepo.findOne.mockResolvedValue(expiredCode);

            const result = await inviteCodeService.validateAndUseInviteCode('ABCD-1234');
            expect(result).toBeNull();
        });

        it('should return null for depleted invite code', async () => {
            const depletedCode = {
                ...mockInviteCode,
                remainingUses: 0
            };
            mockInviteCodeRepo.findOne.mockResolvedValue(depletedCode);

            const result = await inviteCodeService.validateAndUseInviteCode('ABCD-1234');
            expect(result).toBeNull();
        });
    });

    describe('getInviteCodeDetails', () => {
        it('should return invite code details successfully', async () => {
            mockInviteCodeRepo.findOne.mockResolvedValue(mockInviteCode);

            const result = await inviteCodeService.getInviteCodeDetails('ABCD-1234');
            expect(result).toEqual(mockInviteCode);
            expect(mockInviteCodeRepo.findOne).toHaveBeenCalledWith({
                where: { codeHash: expect.any(String) },
                relations: ['referrer']
            });
        });

        it('should return null for non-existent invite code', async () => {
            mockInviteCodeRepo.findOne.mockResolvedValue(null);

            const result = await inviteCodeService.getInviteCodeDetails('NONEXISTENT');
            expect(result).toBeNull();
        });
    });
});