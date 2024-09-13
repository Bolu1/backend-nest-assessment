import { BcryptUtil } from '../bcrypt.util';
import * as bcrypt from 'bcryptjs';

describe('BcryptUtil', () => {
  let bcryptUtil: BcryptUtil;
  const password = 'password123';
  const hashedPassword = 'hashedPassword';

  beforeEach(() => {
    bcryptUtil = new BcryptUtil();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const result = await bcryptUtil.hash(password);

      expect(result).toBe(result);
    });
  });

  describe('compare', () => {
    it('should return true if passwords match', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await bcryptUtil.compare(password, hashedPassword);

      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const result = await bcryptUtil.compare(password, hashedPassword);

      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(false);
    });
  });
});
