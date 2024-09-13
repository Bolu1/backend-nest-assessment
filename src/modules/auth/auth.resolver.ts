import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { ConflictException } from '@nestjs/common';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterInputDto } from './dto/request-input.dto';
import { LoginInputDto } from './dto/login-input.dto';
import { BiometricLoginInputDto } from './dto/biometic-login-input.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  // Mutation for registering a new user
  @Mutation(() => AuthResponseDto)
  async register(
    @Args('data') data: RegisterInputDto,
  ): Promise<AuthResponseDto> {
    const userExists = await this.userService.findByEmail(data.email);
    if (userExists) {
      throw new ConflictException('User already exists');
    }

    return this.authService.register(data);
  }

  // Mutation for logging in with email and password
  @Mutation(() => AuthResponseDto)
  async login(@Args('data') data: LoginInputDto): Promise<AuthResponseDto> {
    return this.authService.login(data);
  }

  // Mutation for biometric login
  @Mutation(() => AuthResponseDto)
  async biometricLogin(
    @Args('data') biometricKey: BiometricLoginInputDto,
  ): Promise<AuthResponseDto> {
    return this.authService.biometricLogin(biometricKey);
  }
}
