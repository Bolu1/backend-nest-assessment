import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '../user/user.module';
import { JwtUtil } from '../../utils/security/jwt.util';
import { BcryptUtil } from '../../utils/security/bcrypt.util';
import { EncryptionUtil } from '../../utils/helpers/encryption.util';
import { JwtStrategy } from './jwt.strategy'; // Import the strategy
import appConfig from '../../config/settings';

@Module({
  imports: [
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: { expiresIn: appConfig.jwt.authDuration },
    }),
    UserModule,
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtUtil,
    BcryptUtil,
    EncryptionUtil,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
