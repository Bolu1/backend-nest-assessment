import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtil {
  constructor(private jwtService: JwtService) {}

  // Method to sign token
  signToken<T extends object>(payload: T): string {
    return this.jwtService.sign(payload);
  }

  // Method to verify a token
  verifyToken<T extends object>(token: string): T {
    return this.jwtService.verify<T>(token);
  }

  // Method to decode a token
  decodeToken<T extends object>(token: string): T {
    return this.jwtService.decode(token) as T;
  }
}
