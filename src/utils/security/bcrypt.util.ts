import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import appConfig from '../../config/settings';

@Injectable()
export class BcryptUtil {
  // Method to hash vales
  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, appConfig.hashing.bcryptSalt);
  }

  //   Method to compare hased value against the original value
  async compare(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }
}
