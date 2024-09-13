import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    biometricKey: 'encryptedBiometricKey',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockResolvedValue([mockUser]),
              findUnique: jest.fn().mockResolvedValue(mockUser),
              create: jest.fn().mockResolvedValue(mockUser),
              findUniqueOrThrow: jest.fn(),
              findFirst: jest.fn(),
              findFirstOrThrow: jest.fn(),
              createMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Delete the created user after all tests
    await prismaService.user.delete({
      where: {
        email: mockUser.email, // You can also use id: mockUser.id
      },
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const result = await service.findById('1');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });

  describe('findByBiometricKey', () => {
    it('should return a user by biometric key', async () => {
      const result = await service.findByBiometricKey('encryptedBiometricKey');
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { biometricKey: 'encryptedBiometricKey' },
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'hashedPassword',
        biometricKey: 'encryptedBiometricKey',
      };

      const result = await service.createUser(userData);
      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe('sanitizeUser', () => {
    it('should remove password and biometricKey from user', () => {
      const sanitizedUser = service.sanitizeUser(mockUser);
      expect(sanitizedUser.password).toBeUndefined();
      expect(sanitizedUser.biometricKey).toBeUndefined();
      expect(sanitizedUser).toEqual({
        id: '1',
        email: 'test@example.com',
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      });
    });
  });
});
