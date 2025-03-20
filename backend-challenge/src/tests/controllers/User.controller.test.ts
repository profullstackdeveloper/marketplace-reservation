import { UserController } from '@src/api/controllers/User.controller';
import { UserService } from '@src/domain/services/User.service';
import { Request, Response } from 'express';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { User } from '@src/domain/models/User.entity';

describe('UserController', () => {
    let userController: UserController;
    let mockUserService: jest.Mocked<UserService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    const mockUser: User = {
        id: '1',
        email: 'test@example.com',
        inviteCode: 'TEST123',
        createdAt: new Date(),
    };

    beforeEach(() => {
        mockUserService = {
            register: jest.fn(),
            tracker: jest.fn(),
        } as unknown as jest.Mocked<UserService>;

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as Partial<Response>;

        userController = new UserController(mockUserService);
    });

    describe('register', () => {
        it('should successfully register a user', async () => {
            mockRequest = {
                body: {
                    email: 'test@example.com',
                    inviteCode: 'TEST123'
                }
            };
            mockUserService.register.mockResolvedValue(mockUser);

            await userController.register(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.register).toHaveBeenCalledWith(
                'test@example.com',
                'TEST123'
            );
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.CREATED);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Registration successful',
                user: mockUser
            });
        });

        it('should handle registration errors', async () => {
            mockRequest = {
                body: { email: 'test@example.com' }
            };
            mockUserService.register.mockRejectedValue(new Error('Email already registered'));

            await userController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.BAD_REQUEST);
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                error: 'Email already registered' 
            });
        });
    });

    describe('getTrackerData', () => {
        it('should return tracker data successfully', async () => {
            const trackerData = {
                referrer: mockUser,
                referrees: [
                    { ...mockUser, id: '2', referrerId: mockUser.id },
                    { ...mockUser, id: '3', referrerId: mockUser.id }
                ]
            };
            
            mockRequest = {
                params: { inviteCode: 'TEST123' }
            };
            mockUserService.tracker.mockResolvedValue(trackerData);

            await userController.getTrackerData(mockRequest as Request, mockResponse as Response);

            expect(mockUserService.tracker).toHaveBeenCalledWith('TEST123');
            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
            expect(mockResponse.json).toHaveBeenCalledWith(trackerData);
        });

        it('should handle tracker errors', async () => {
            mockRequest = {
                params: { inviteCode: 'INVALID' }
            };
            mockUserService.tracker.mockRejectedValue(new Error('Invalid invite code'));

            await userController.getTrackerData(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(HttpStatusCodes.BAD_REQUEST);
            expect(mockResponse.json).toHaveBeenCalledWith({ 
                error: 'Invalid invite code' 
            });
        });
    });
}); 