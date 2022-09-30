import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { Op, WhereOptions } from 'sequelize';

import { User, Contact } from '../../database';
import { UserAttributes, UserModel } from '../../database/models/user';
import { MailService } from '../mail/index';
import { toArray } from '../../utils/to-array';
import { PrimaryKey } from '../../types';
import { AuthenticationService } from '../authentication';
import { TenantService } from '../tenant';
import ContextQuery from '../utils/ContextQuery';
import { AuthUser } from 'lib/middlewares/auth';
import { Forbidden, InvalidPayload } from 'lib/middlewares/exception';

const env = process.env;

type TUserInfo = {
  currency?: string;
  datetimeFormat?: string;
  email?: string;
  firstName?: string;
  language?: string;
  lastName?: string;
  timezone?: string;
  avatar?: string;
  title?: string;
  phone?: string;
};

abstract class UserService extends ContextQuery<UserModel> {
  async getSelf() {
    const user = await this.model.findOne({
      where: {
        id: this.user.id,
      },
    });

    return user?.toJSON();
  }

  async updateSelf(
    payload: Omit<UserAttributes, 'id' | 'email' | 'role' | 'tenant_id'>
  ) {
    await this.model.update(payload, {
      where: { id: this.user.id, tenant_id: this.user.tenant },
    });
  }

  async getByEmail(email: string) {
    const user = await this.model.findOne({
      attributes: ['id', 'status', 'tenant_id', 'role'],
      where: { email: email.toLocaleLowerCase() },
    });

    return user?.toJSON();
  }

  async getUser(userId: string, tenant_id?: string) {
    const where: any = {
      id: userId,
      ...this.getContextQuery(),
    };

    if (tenant_id) {
      where.tenant_id = tenant_id;
    }

    return await User.findOne({
      attributes: [
        'id',
        'first_name',
        'last_name',
        'email',
        'role',
        'location',
        'avatar',
        'status',
        'title',
        'phone',
        'tenant_id',
      ],
      where,
      include: 'roleInfo',
    });
  }

  async updateUserInfo(props: TUserInfo) {
    const where: WhereOptions = this.getContextQuery();

    const user = await User.findOne({
      attributes: ['id', 'status'],
      where: { email: props.email, ...where },
    });

    if (!user || user.status !== 'active') {
      throw new Forbidden();
    }

    const { firstName, lastName, avatar, title, phone } = props;

    await User.update(
      {
        first_name: firstName,
        last_name: lastName,
        avatar: avatar,
        title,
        phone,
      },
      {
        where: { id: user.id, ...where },
      }
    );

    return { ...props };
  }

  async updateUserRole(props: any) {
    const { id, role } = props;
    const where: WhereOptions = { id, ...this.getContextQuery() };

    await User.update({ role }, { where });

    return { ...props };
  }

  async updateUserById(props: any) {
    const where: WhereOptions = { id: props.id, ...this.getContextQuery() };

    const foundUser = await User.findOne({
      attributes: ['status'],
      where,
    });

    if (!foundUser) {
      throw new Forbidden();
    }

    const { firstName, lastName, avatar, status, role, title, phone } = props;
    await User.update(
      {
        first_name: firstName,
        last_name: lastName,
        avatar,
        status,
        role,
        title,
        phone,
      },
      { where }
    );

    return { ...props };
  }

  async changeStatusById(id: string, status: string): Promise<any> {
    const where: WhereOptions = { id, ...this.getContextQuery() };

    const foundUser = await User.findOne({
      attributes: ['first_name', 'last_name', 'email', 'role', 'avatar'],
      where,
    });

    if (!foundUser) {
      throw new Forbidden();
    }

    await User.update({ status }, { where });

    foundUser.status = status;

    return foundUser;
  }

  async deleteAll(keys: PrimaryKey[]) {
    return await Promise.all(
      keys.map(async (key: PrimaryKey) => {
        try {
          const where: WhereOptions = { id: key, ...this.getContextQuery() };
          const foundUser = await User.findOne({ where });
          if (!foundUser) {
            throw new Forbidden();
          }

          await User.update({ status: 'deactivated' }, { where: { id: key } });
          return { id: key, result: 'success', msg: '' };
        } catch (error: any) {
          return {
            id: key,
            result: 'failed',
            msg: error.message,
          };
        }
      })
    );
  }

  async requestPasswordReset(
    email: string,
    url: string | null,
    subject?: string | null
  ) {
    const user = await User.findOne({
      attributes: ['id', 'email', 'tenant_id'],
      where: { email: email },
    });

    if (!user) throw new Forbidden();

    const mailService = new MailService();
    const tenant = await TenantService.getTenantById(user.tenant_id);

    const payload = {
      email,
      scope: 'password-reset',
      id: user.id,
      tenant_id: user.tenant_id,
    };
    const token = jwt.sign(payload, env.SECRET as string, { expiresIn: '1d' });

    const acceptURL = url
      ? `${url}?token=${token}`
      : `${tenant.domain || env.PUBLIC_URL}/reset-password?token=${token}`;
    const subjectLine = subject
      ? subject
      : 'Forgot your password on Identifee?';

    const tplData = await TenantService.getMailThemeData(user.tenant_id);
    await mailService.send({
      to: email,
      tenant_id: user.tenant_id,
      subject: subjectLine,
      template: {
        name: 'password-reset',
        data: {
          ...tplData,
          url: acceptURL,
          resetUrl: env.PUBLIC_URL + '/reset-password',
          email,
        },
      },
    });
  }

  async passwordReset(
    user: {
      email: string;
      tenant_id: string;
      password: string;
    },
    subject?: string | null
  ) {
    const mailService = new MailService();
    const subjectLine = subject ? subject : 'A new password was generated';
    const tplData = await TenantService.getMailThemeData(user.tenant_id);
    await mailService.send({
      to: user.email,
      tenant_id: user.tenant_id,
      subject: subjectLine,
      template: {
        name: 'password-reseted',
        data: {
          ...tplData,
          password: user.password,
        },
      },
    });
  }

  async resetPasswordEmail(user: { tenant_id: string; email: string }) {
    const mailService = new MailService();

    const tplData = await TenantService.getMailThemeData(user.tenant_id);

    await mailService.send({
      to: user.email,
      tenant_id: user.tenant_id,
      subject: 'Your new password on Identifee',
      template: {
        name: 'password-changed',
        data: {
          ...tplData,
          email: user.email,
        },
      },
    });
  }

  async sendEmailInvite(
    id: string,
    tenant: string,
    email: string,
    url: string | null,
    subject?: string | null
  ) {
    const mailService = new MailService();

    const payload = {
      id,
      email: email.trim().toLocaleLowerCase(),
      scope: 'invited',
      // if super admin is inviting, then the invitee tenant should be the tenant_id
      tenant_id: tenant || this.user.tenant,
    };
    const token = jwt.sign(payload, env.SECRET as string, {
      expiresIn: '7d',
    });
    const tplData = await TenantService.getMailThemeData(payload.tenant_id);
    const inviteURL = url ?? tplData.projectUrl + '/sign-up';
    const acceptURL = inviteURL + '?token=' + token;
    const subjectLine = subject ? subject : 'Welcome to Identifee';

    await mailService.send({
      to: email,
      subject: subjectLine,
      tenant_id: payload.tenant_id,
      template: {
        name: 'user-invitation',
        data: {
          ...tplData,
          url: acceptURL,
          email,
        },
      },
    });
  }

  async inviteUser(
    tenant: string,
    email: string,
    role: string,
    url: string | null,
    subject?: string | null
  ) {
    // TODO enforce this through index
    const user = await this.getByEmail(email);
    if (user) {
      throw new InvalidPayload(
        `There is already an account associated with this email.`
      );
    }

    const newUser = {
      id: uuidv4() as string,
      email: email.trim().toLocaleLowerCase(),
      role,
      status: 'invited',
      tenant_id: tenant || this.user.tenant,
    };

    await User.create(newUser);

    await this.sendEmailInvite(newUser.id, tenant, email, url, subject);
  }

  async resendInvite(
    id: string,
    email: string,
    url: string | null,
    subject?: string | null
  ) {
    const urlWhitelist = toArray(
      env.USER_INVITE_URL_ALLOW_LIST || env.PUBLIC_URL
    );

    if (url && urlWhitelist.includes(url) === false) {
      throw new InvalidPayload(`Url "${url}" can't be used to invite users.`);
    }

    const user = await User.findOne({
      attributes: ['status'],
      where: { id, ...this.getContextQuery() },
    });

    if (!user) {
      throw new InvalidPayload(`Email address ${email} hasn't been invited.`);
    }

    if (user?.status !== 'invited') {
      throw new InvalidPayload(`Email address ${email} is already registered.`);
    }

    await this.sendEmailInvite(id, user.tenant_id, email, url, subject);
  }

  async message(name: string, email: string, message: string) {
    const regexValidateEmail =
      // eslint-disable-next-line no-useless-escape
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regexValidateEmail.test(email)) {
      throw new InvalidPayload(`Invalid Email`);
    }

    const mailService = new MailService();

    return await mailService.send({
      tenant_id: this.user.tenant,
      to: env.SUPPORT_EMAIL || env.EMAIL_FROM,
      replyTo: email,
      subject: 'help center',
      text: message,
      html: `
				<div>
					<h4>${name}<${email}> </h4>
					<p>${message}</p>
				</div>
			`,
    });
  }

  async impersonate(id: string): Promise<any> {
    const where: WhereOptions = { id, ...this.getContextQuery() };

    const foundUser = await User.findOne({
      attributes: ['id', 'status', 'tenant_id'],
      where,
    });

    if (!foundUser) {
      throw new InvalidPayload(`User ${id} not found.`);
    }

    const authService = new AuthenticationService();
    const tk = authService.getImpersonationToken(
      foundUser.tenant_id,
      id,
      this.user.id
    );

    return tk;
  }

  async getMatchGuests(search: string): Promise<any> {
    const [contacts, users] = await Promise.all([
      Contact.findAndCountAll({
        where: {
          ...this.getContextQuery(),
          deleted: false,
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email_work: { [Op.iLike]: `%${search}%` } },
            { email_home: { [Op.iLike]: `%${search}%` } },
          ],
        },
      }),
      User.findAndCountAll({
        where: {
          ...this.getContextQuery(),
          status: 'active',
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
          ],
        },
      }),
    ]);

    return [...contacts.rows, ...users.rows];
  }

  async getGuestByIds(ids: Array<string>) {
    const [contacts, users] = await Promise.all([
      Contact.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }),
      User.findAll({
        where: {
          id: {
            [Op.in]: ids,
          },
        },
      }),
    ]);

    return {
      contacts,
      users,
    };
  }
}

export class AdminUserService extends UserService {
  getContextQuery() {
    return {};
  }
}

export class OwnerUserService extends UserService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserUserService extends UserService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function userServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminUserService(User, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerUserService(User, user);
  }

  return new UserUserService(User, user);
}
