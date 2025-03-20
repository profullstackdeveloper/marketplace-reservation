import { UserService } from '@src/domain/services/User.service';
import { dataSource } from '@src/infrastructure/database/db';
import { User } from '@src/domain/models/User.entity';
import { Repository } from 'typeorm';

jest.mock('@src/infrastructure/database/db', () => ({
    dataSource: {
        getRepository: jest.fn()
    }
}));

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<Repository<User>>;

    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        inviteCode: 'TEST123',
        createdAt: new Date(),
    };

    const mockReferrer: User = {
        id: '2',
        email: 'referrer@example.com',
        inviteCode: 'REF123',
        createdAt: new Date(),
    };

    beforeEach(() => {
        mockUserRepository = {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
        } as unknown as jest.Mocked<Repository<User>>;

        (dataSource.getRepository as jest.Mock).mockReturnValue(mockUserRepository);
        
        userService = new UserService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should register a new user without invite code', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await userService.register('test@example.com');

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: 'test@example.com' }
            });
            expect(mockUserRepository.save).toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        it('should throw error if email already exists', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(userService.register('test@example.com'))
                .rejects.toThrow('Email already registered');
            
            expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });

        it('should register with valid invite code', async () => {
            const newUser = { ...mockUser, referrerId: mockReferrer.id };
            
            mockUserRepository.findOne
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockReferrer);
            mockUserRepository.count.mockResolvedValue(0);
            mockUserRepository.create.mockReturnValue(newUser);
            mockUserRepository.save.mockResolvedValue(newUser);

            const result = await userService.register('test@example.com', 'REF123');

            expect(result.referrerId).toBe(mockReferrer.id);
            expect(mockUserRepository.count).toHaveBeenCalledWith({
                where: { referrerId: mockReferrer.id }
            });
        });

        it('should throw error when invite code usage exceeds limit', async () => {
            mockUserRepository.findOne
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(mockReferrer);
            mockUserRepository.count.mockResolvedValue(10);

            await expect(userService.register('test@example.com', 'REF123'))
                .rejects.toThrow('Exceed limitation for this code.');
        });
    });

    describe('tracker', () => {
        it('should return referrer and referrees data', async () => {
            const mockReferrees = [
                { ...mockUser, id: '3', referrerId: mockReferrer.id },
                { ...mockUser, id: '4', referrerId: mockReferrer.id }
            ];

            mockUserRepository.findOne.mockResolvedValue(mockReferrer);
            mockUserRepository.find.mockResolvedValue(mockReferrees);

            const result = await userService.tracker('REF123');

            expect(result).toEqual({
                referrer: mockReferrer,
                referrees: mockReferrees
            });
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { inviteCode: 'REF123' }
            });
            expect(mockUserRepository.find).toHaveBeenCalledWith({
                where: { referrerId: mockReferrer.id }
            });
        });

        it('should return empty object for invalid invite code', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await userService.tracker('INVALID');

            expect(result).toEqual({});
            expect(mockUserRepository.find).not.toHaveBeenCalled();
        });
    });
}); 