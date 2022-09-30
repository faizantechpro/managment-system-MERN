import { OrganizationGuest } from 'lib/database';
import { StaticModel } from 'lib/database/helpers';
import {
  OrganizationGuestAttributes,
  OrganizationGuestModel,
  OrganizationGuestModifyAttributes,
} from 'lib/database/models/organizationGuest';
import { UserContext } from 'lib/middlewares/openapi';
import { contactServiceFactory } from './contacts';
import { JWT } from './JWT';
import Base from './utils/Base';

export class OrganizationGuestService<
  U extends StaticModel<OrganizationGuestModel> = StaticModel<OrganizationGuestModel>
> extends Base<OrganizationGuestModel> {
  private jwt = new JWT();

  constructor(model: U, user: UserContext) {
    super(model, user);

    this.jwt = new JWT();
  }

  async getByEmail(email: string) {
    const contact = await this.model.findOne({
      where: {
        email,
      },
    });

    return contact?.toJSON();
  }

  async create(payload: OrganizationGuestModifyAttributes) {
    const contactService = contactServiceFactory(this.user);
    const contact = await contactService.getContactById(payload.contact_id);
    if (!contact) {
      return Promise.reject({ status: 404 });
    }
    if (!contact.organization_id) {
      return Promise.reject({ status: 400 });
    }

    payload.tenant_id = contact.tenant_id;
    payload.organization_id = contact.organization_id;
    payload.shared_by_user_id = this.user.id;

    const guest = await this.model.create(payload, { returning: true });

    return {
      ...guest.toJSON(),
      token: this.generateToken(guest),
    };
  }

  async deleteGuest(contact_id: string, organization_id: string) {
    return await this.model.destroy({
      where: {
        contact_id,
        organization_id,
      },
    });
  }

  generateToken(payload: OrganizationGuestAttributes) {
    return this.jwt.generate(
      {
        scope: 'guest',
        email: payload.email,
        tenant_id: payload.tenant_id,
        shared_by_id: payload.shared_by_user_id,
        contact_id: payload.contact_id,
        resource_access: {
          organization: [
            {
              id: payload.organization_id,
            },
          ],
        },
      },
      {
        expiresIn: '30m',
      }
    );
  }

  refreshToken(jwt: string) {
    const refreshJWT = new JWT(jwt);
    try {
      refreshJWT.verify(true);

      if (!refreshJWT.payload) {
        throw new Error('Invalid token provided');
      }
    } catch (error) {
      throw new Error('Invalid token provided');
    }

    // remove the jwt signature keys
    const { iat, exp, ...payload } = refreshJWT.payload;
    const refreshedJWT = new JWT();
    refreshedJWT.generate(
      {
        ...payload,
      },
      {
        expiresIn: '30m',
      }
    );
    if (refreshedJWT.payload?.scope !== 'guest') {
      throw new Error('Invalid token provided');
    }

    return {
      token: refreshedJWT.token,
      payload: refreshedJWT.payload,
    };
  }
}

export function organizationGuestServiceFactory(user: UserContext) {
  return new OrganizationGuestService(OrganizationGuest, user);
}
