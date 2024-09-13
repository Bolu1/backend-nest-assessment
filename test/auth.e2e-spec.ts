import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient; // Prisma client instance
  const createdUserEmail = 'test@example.com'; // Store the email for later deletion

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = new PrismaClient(); // Initialize Prisma Client
  });

  afterAll(async () => {
    // Use Prisma to delete the user after tests
    await prisma.user.delete({
      where: {
        email: createdUserEmail,
      },
    });

    await prisma.$disconnect(); // Disconnect Prisma after use
    await app.close(); // Close the app after the test
  });

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
            mutation Register {
                register(
                    data: { email: "${createdUserEmail}", password: "123456", biometricKey: "test" }
                ) {
                    accessToken
                }
            }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.register.accessToken).toBeDefined();
      });
  });

  it('should login a user', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
            mutation Login {
                login(data: { email: "${createdUserEmail}", password: "123456" }) {
                    accessToken
                }
            }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.login.accessToken).toBeDefined();
      });
  });
});
