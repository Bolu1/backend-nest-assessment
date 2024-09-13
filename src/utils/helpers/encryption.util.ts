import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import appConfig from '../../config/settings';

@Injectable()
export class EncryptionUtil {
  private readonly algorithm = appConfig.encryption.algorithm;
  private readonly key = crypto.scryptSync(
    appConfig.encryption.secretKey,
    appConfig.encryption.salt,
    32,
  );
  private readonly iv = crypto.randomBytes(16); // Initialization vector

  encrypt(text: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted + ':' + this.iv.toString('hex'); // Append IV for later decryption
  }

  decrypt(encryptedText: string): string {
    const [encrypted, iv] = encryptedText.split(':'); // Separate IV from encrypted text
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
