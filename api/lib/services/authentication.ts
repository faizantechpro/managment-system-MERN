import jwt from 'jsonwebtoken';
import ms from 'ms';
import { nanoid } from 'nanoid';
import { totp } from 'otplib';
import { User, Session } from '../database';
import { emitter, emitAsyncSafe } from '../middlewares/emitter';
import { merge } from 'lodash';
import { Op } from 'sequelize';
import { MailService } from './mail';
import { TenantService } from './tenant';
import { userCredentialFactory, userServiceFactory } from './user';
import {
  InvalidCredentials,
  InvalidOTP,
  UserSuspended,
} from 'lib/middlewares/exception';

const TFA_WITH_EMAIL = (process.env.TFA_WITH_EMAIL as string) || '';

// generate 6 digits and TTL of 60 seconds
const TFA_STEP_TIME = parseInt(process.env.TFA_STEP_TIME as string) || 60;
const TFA_WINDOW = (parseInt(process.env.TFA_WINDOW as string) as number) || 2;

totp.options = { digits: 6, step: TFA_STEP_TIME, window: TFA_WINDOW };

type AuthenticateOptions = {
  email: string;
  password?: string;
  ip?: string | null;
  userAgent?: string | null;
  otp?: string;
  [key: string]: any;
};

export class AuthenticationService {
  /**
   * Retrieve the tokens for a given user email.
   *
   * Password is optional to allow usage of this function within the SSO flow and extensions. Make sure
   * to handle password existence checks elsewhere
   */
  async authenticate(options: AuthenticateOptions): Promise<{
    accessToken: any;
    refreshToken: any;
    expires: any;
    id?: any;
    tenant_id: string;
  }> {
    const { email, password, ip, userAgent, otp } = options;
    const invalidCredentialsMessage =
      'Incorrect email or password. Please try again.';

    const userService = userServiceFactory({} as any);
    let user = await userService.getByEmail(email);

    // TODO revisit this one
    const updatedUser = await emitter.emitAsync('auth.login.before', options, {
      event: 'auth.login.before',
      action: 'login',
      schema: 'users',
      payload: options,
      status: 'pending',
      user: user?.id,
      tenant_id: user?.tenant_id,
    });

    if (updatedUser) {
      user =
        updatedUser.length > 0
          ? updatedUser.reduce((val, acc) => merge(acc, val))
          : user;
    }

    const emitStatus = (status: 'fail' | 'success') => {
      emitAsyncSafe('auth.login', options, {
        event: 'auth.login',
        action: 'login',
        schema: 'users',
        payload: options,
        status,
        user: user?.id,
        tenant_id: user?.tenant_id,
      });
    };

    if (!user || user.status !== 'active') {
      emitStatus('fail');

      if (user?.status === 'deactivated') {
        throw new UserSuspended(
          'This account is suspended, please contact the Administrator to activate your account.'
        );
      } else {
        throw new InvalidCredentials(invalidCredentialsMessage);
      }
    }

    const credentialService = userCredentialFactory({ id: user.id } as any);
    const credential = await credentialService.getOne();
    if (!credential) {
      emitStatus('fail');
      throw new InvalidCredentials(invalidCredentialsMessage);
    }

    if (password) {
      if (!credential.password) {
        emitStatus('fail');
        throw new InvalidCredentials(invalidCredentialsMessage);
      }

      const validPassword = await credentialService.verifyPassword(
        credential.password,
        password
      );
      if (!validPassword) {
        emitStatus('fail');
        throw new InvalidCredentials(invalidCredentialsMessage);
      }
    }

    // 2FA via email/SMS

    if (TFA_WITH_EMAIL !== 'false' && !otp) {
      if (!credential.tfa_secret) {
        emitStatus('fail');
        throw new InvalidCredentials(invalidCredentialsMessage);
      }

      const code = credentialService.generateTOTP(credential.tfa_secret);
      const mailService = new MailService();
      const tplData = await TenantService.getMailThemeData(user.tenant_id);
      await mailService.send({
        to: email,
        tenant_id: user.tenant_id,
        subject: 'Identifee Verification Required',
        template: {
          name: 'email-2fa',
          data: {
            ...tplData,
            code,
          },
        },
      });

      return {
        accessToken: 'otp_enabled',
        refreshToken: 'otp_enabled',
        expires: 0,
        id: user.id,
        tenant_id: user.tenant_id,
      };
    }

    if (credential.tfa_secret && !otp) {
      emitStatus('fail');
      throw new InvalidOTP(`"otp" is required`);
    }

    if (credential.tfa_secret && otp) {
      // Google Auth
      if (credential.tfa_secret && TFA_WITH_EMAIL === '') {
        const otpValid = await credentialService.verifyOTP(
          credential.tfa_secret,
          otp
        );
        if (!otpValid) {
          emitStatus('fail');
          throw new InvalidOTP(`"otp" is invalid`);
        }
        // SMS or EMAIL based
      } else if (TFA_WITH_EMAIL !== '') {
        const otpValid = await credentialService.verifyTOTP(
          credential.tfa_secret,
          otp
        );
        if (!otpValid) {
          emitStatus('fail');
          throw new InvalidOTP(`"totp" is invalid`);
        }
      }
    }

    const payload = {
      id: user.id,
      scope: 'profile',
      tenant_id: user.tenant_id,
    };

    // update last access time
    await User.update(
      { last_access: new Date() },
      { where: { id: user.id, tenant_id: user.tenant_id } }
    );

    /**
     * @TODO
     * Sign token with combination of server secret + user password hash
     * That way, old tokens are immediately invalidated whenever the user changes their password
     */
    const accessToken = jwt.sign(payload, process.env.SECRET as string, {
      expiresIn: process.env.ACCESS_TOKEN_TTL || '15m',
    });

    const refreshToken = nanoid(64);
    const refreshTokenExpiration = new Date(
      Date.now() + ms(process.env.REFRESH_TOKEN_TTL as string)
    );

    // stores session
    await Session.create({
      token: refreshToken,
      user: user.id,
      expires: refreshTokenExpiration,
      ip: ip,
      user_agent: userAgent,
      tenant_id: user.tenant_id,
    });

    await Session.destroy({
      where: {
        expires: {
          [Op.lt]: new Date(),
        },
      },
    });

    emitStatus('success');

    return {
      accessToken,
      refreshToken,
      expires:
        new Date().getTime() + ms(process.env.ACCESS_TOKEN_TTL as string),
      id: user.id,
      tenant_id: user.tenant_id,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await Session.destroy({ where: { token: refreshToken } });
  }

  async getImpersonationToken(
    tenant: string,
    userId: string,
    impersonator: string
  ) {
    const payload = {
      id: userId,
      impersonator,
      scope: 'impersonation',
      tenant_id: tenant,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET as string, {
      expiresIn: process.env.ACCESS_TOKEN_TTL || '15m',
    });

    const refreshToken = nanoid(64);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires:
        new Date().getTime() + ms(process.env.ACCESS_TOKEN_TTL as string),
      id: userId,
    };
  }
}
