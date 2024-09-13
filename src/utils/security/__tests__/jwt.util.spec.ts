import { JwtService } from '@nestjs/jwt';
import { JwtUtil } from '../jwt.util';

describe('JwtUtil', () => {
  let jwtUtil: JwtUtil;
  let jwtService: Partial<JwtService>;
  const payload = { userId: '1' };

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    jwtUtil = new JwtUtil(jwtService as JwtService);
  });

  it('should sign a token', () => {
    jest.spyOn(jwtService, 'sign').mockReturnValue('token');
    const token = jwtUtil.signToken(payload);
    expect(token).toBe('token');
  });

  it('should verify a token', () => {
    jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
    const result = jwtUtil.verifyToken('token');
    expect(result).toEqual(payload);
  });
});
