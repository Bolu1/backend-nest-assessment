import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtUtil } from '../../../utils/security/jwt.util';
import { BcryptUtil } from '../../../utils/security/bcrypt.util';
import { EncryptionUtil } from '../../../utils/helpers/encryption.util';
import { UnauthorizedException } from '@nestjs/common';
import { RegisterInputDto } from '../dto/request-input.dto';
import { LoginInputDto } from '../dto/login-input.dto';
import { BiometricLoginInputDto } from '../dto/biometic-login-input.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<UserService>;
  let jwtUtil: Partial<JwtUtil>;
  let bcryptUtil: Partial<BcryptUtil>;
  let encryptionUtil: Partial<EncryptionUtil>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    biometricKey: 'encryptedBiometricKey',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    userService = {
      createUser: jest.fn().mockResolvedValue(mockUser),
      findByEmail: jest.fn().mockResolvedValue(mockUser),
      findByBiometricKey: jest.fn().mockResolvedValue(mockUser),
      sanitizeUser: jest.fn((user) => ({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    };

    jwtUtil = {
      signToken: jest.fn().mockReturnValue('testToken'),
    };

    bcryptUtil = {
      hash: jest.fn().mockResolvedValue('hashedPassword'),
      compare: jest.fn().mockResolvedValue(true),
    };

    encryptionUtil = {
      encrypt: jest.fn().mockReturnValue('encryptedBiometricKey'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtUtil, useValue: jwtUtil },
        { provide: BcryptUtil, useValue: bcryptUtil },
        { provide: EncryptionUtil, useValue: encryptionUtil },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const input: RegisterInputDto = {
        email: 'test@example.com',
        password: '123456',
        biometricKey: 'testKey',
      };

      const result = await authService.register(input);

      expect(userService.createUser).toHaveBeenCalledWith({
        email: input.email,
        password: 'hashedPassword',
        biometricKey: 'encryptedBiometricKey',
      });
      expect(jwtUtil.signToken).toHaveBeenCalledWith({ userId: mockUser.id });
      expect(result.accessToken).toBe('testToken');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const input: LoginInputDto = {
        email: 'test@example.com',
        password: '123456',
      };

      const result = await authService.login(input);

      expect(userService.findByEmail).toHaveBeenCalledWith(input.email);
      expect(bcryptUtil.compare).toHaveBeenCalledWith(
        input.password,
        mockUser.password,
      );
      expect(jwtUtil.signToken).toHaveBeenCalledWith({ userId: mockUser.id });
      expect(result.accessToken).toBe('testToken');
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      jest.spyOn(bcryptUtil, 'compare').mockResolvedValue(false);

      const input: LoginInputDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      await expect(authService.login(input)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('biometricLogin', () => {
    it('should login successfully with correct biometric key', async () => {
      const input: BiometricLoginInputDto = { biometricKey: 'testKey' };

      const result = await authService.biometricLogin(input);

      expect(encryptionUtil.encrypt).toHaveBeenCalledWith(input.biometricKey);
      expect(userService.findByBiometricKey).toHaveBeenCalledWith(
        'encryptedBiometricKey',
      );
      expect(jwtUtil.signToken).toHaveBeenCalledWith({ userId: mockUser.id });
      expect(result.accessToken).toBe('testToken');
    });

    it('should throw UnauthorizedException for invalid biometric key', async () => {
      jest.spyOn(userService, 'findByBiometricKey').mockResolvedValue(null);

      const input: BiometricLoginInputDto = { biometricKey: 'invalidKey' };

      await expect(authService.biometricLogin(input)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
