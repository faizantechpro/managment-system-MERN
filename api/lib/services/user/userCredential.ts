import argon2 from 'argon2';
import * as gp from 'generate-password';
import { UserCredential } from 'lib/database';
import {
  UserCredentialAttributes,
  UserCredentialModel,
  UserCredentialModifyAttributes,
} from 'lib/database/models/user';
import { AuthUser } from 'lib/middlewares/auth';
import { authenticator, totp } from 'otplib';
import Base from '../utils/Base';

class UserCredentialService extends Base<UserCredentialModel> {
  async getOne() {
    const credential = await this.model.findOne({
      where: {
        user_id: this.user.id,
      },
    });

    return credential?.toJSON();
  }

  generatePassword() {
    const generatedPassword = gp.generate({
      length: 8,
      numbers: true,
      symbols: true,
      lowercase: true,
      uppercase: true,
      strict: true,
      exclude: '`\'"',
    });

    return generatedPassword;
  }

  generateTFASecret() {
    const tfaSecret = authenticator.generateSecret();
    return tfaSecret;
  }

  generateTOTP(tfaSecret: string) {
    return totp.generate(tfaSecret);
  }

  async upsert(
    payload: UserCredentialModifyAttributes & { generateTFASecret?: boolean }
  ) {
    const data: UserCredentialAttributes = {
      user_id: this.user.id,
      password: payload.password,
    };

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }
    if (payload.generateTFASecret) {
      data.tfa_secret = this.generateTFASecret();
    }

    await this.model.upsert(data);
  }

  async verifyOTP(tfaSecret: string, otp: string) {
    return authenticator.check(otp, tfaSecret);
  }

  async verifyTOTP(tfaSecret: string, code: string) {
    return totp.check(code, tfaSecret);
  }

  async verifyPassword(userPassword: string, password: string) {
    const isVerified = await argon2.verify(userPassword, password);
    return isVerified;
  }
}

export function userCredentialFactory(user: AuthUser) {
  return new UserCredentialService(UserCredential, user);
}
