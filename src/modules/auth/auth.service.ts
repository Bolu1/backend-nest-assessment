import { UserInfoInJwt } from './interfaces/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtUtil } from '../../utils/security/jwt.util';
import { RegisterInputDto } from './dto/request-input.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { BcryptUtil } from '../../utils/security/bcrypt.util';
import { LoginInputDto } from './dto/login-input.dto';
import { BiometricLoginInputDto } from './dto/biometic-login-input.dto';
import { EncryptionUtil } from '../../utils/helpers/encryption.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtUtil: JwtUtil,
    private readonly bcryptUtil: BcryptUtil,
    private readonly encryptionUtil: EncryptionUtil,
  ) {}

  async register(data: RegisterInputDto): Promise<AuthResponseDto> {
    // Hash the password
    const hashedPassword = await this.bcryptUtil.hash(data.password);

    // Encrypt the biometric key if provided
    let encryptedBiometricKey: string | null = null;
    if (data.biometricKey) {
      encryptedBiometricKey = this.encryptionUtil.encrypt(data.biometricKey);
    }

    // Create the user in the database
    const user = await this.userService.createUser({
      email: data.email,
      password: hashedPassword,
      biometricKey: encryptedBiometricKey, // Store the encrypted biometricKey
    });

    return {
      user: this.userService.sanitizeUser(user),
      accessToken: this.jwtUtil.signToken<UserInfoInJwt>({ userId: user.id }),
    };
  }

  async login(data: LoginInputDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByEmail(data.email);
    if (
      !user ||
      !(await this.bcryptUtil.compare(data.password, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: this.userService.sanitizeUser(user),
      accessToken: this.jwtUtil.signToken<UserInfoInJwt>({ userId: user.id }),
    };
  }

  async biometricLogin(data: BiometricLoginInputDto): Promise<AuthResponseDto> {
    const encryptedBiometricKey = this.encryptionUtil.encrypt(
      data.biometricKey,
    );

    // Find the user by encrypted biometric key
    const user = await this.userService.findByBiometricKey(
      encryptedBiometricKey,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    return {
      user: this.userService.sanitizeUser(user),
      accessToken: this.jwtUtil.signToken({ userId: user.id }),
    };
  }
}
