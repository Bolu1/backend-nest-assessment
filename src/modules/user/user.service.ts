import { Injectable } from '@nestjs/common';
import { User } from './models/user.model';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Retrieve all users from the database
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Find a user by their ID
  async findById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  // Find a user by their email address
  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  // Find a user by their biometric key
  async findByBiometricKey(biometricKey: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { biometricKey } });
  }

  // Create a new user in the database
  async createUser(data: {
    email: string;
    password: string;
    biometricKey?: string;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        biometricKey: data.biometricKey || null,
      },
    });
  }

  // Sanitize user object by removing sensitive fields
  sanitizeUser(user: User): User {
    delete user.password; // Remove password
    delete user.biometricKey; // Remove biometric key
    return user;
  }
}
