import { Organization, RelatedOrganization } from 'lib/database';
import {
  RelatedOrganizationModel,
  RelatedOrganizationAttributes,
} from 'lib/database/models/relatedOrganization';
import { AuthUser } from 'lib/middlewares/auth';
import { Op } from 'sequelize';
import ContextQuery from './utils/ContextQuery';

abstract class RelatedOrganizationService extends ContextQuery<RelatedOrganizationModel> {
  async add(data: RelatedOrganizationAttributes) {
    const { organization_id, related_id, type } = data;
    const findRelatedOrganization = await RelatedOrganization.findOne({
      where: {
        organization_id,
        related_id,
        type,
        tenant_id: this.user.tenant,
        deleted_on: null,
      },
    });

    if (findRelatedOrganization) {
      return { message: 'organization relation already exist' };
    }

    const relatedOrganization = await RelatedOrganization.create({
      organization_id,
      related_id,
      type,
      tenant_id: this.user.tenant,
    });
    return relatedOrganization.toJSON();
  }

  async getQuery(organization_id: string) {
    return await RelatedOrganization.findAll({
      where: {
        [Op.or]: {
          organization_id,
          related_id: organization_id,
        },
        deleted_on: null,
        ...this.getContextQuery(),
      },
      attributes: ['id', 'type'],
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name'],
        },
        {
          model: Organization,
          as: 'related',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async getSiblings(organization_id: string, parentIds: Array<string>) {
    return await RelatedOrganization.findAll({
      where: {
        related_id: parentIds,
        organization_id: { [Op.ne]: organization_id },
        type: 'parent',
        deleted_on: null,
        ...this.getContextQuery(),
      },
      attributes: ['id', 'type'],
      include: [
        {
          model: Organization,
          as: 'organization',
          attributes: ['id', 'name'],
        },
      ],
    });
  }

  async get(organization_id: string) {
    const relatedOrganizations = await this.getQuery(organization_id);

    let relationships = relatedOrganizations.map((relatedOrganization: any) => {
      const { id, organization, related, type } = relatedOrganization;
      let related_organization = related;
      let calculated_type = type;

      if (related.id === organization_id) {
        related_organization = organization;
        calculated_type = type === 'related' ? type : 'daughter';
      }

      return {
        id,
        type,
        calculated_type,
        related_organization_id: related_organization.id,
        related_organization_name: related_organization.name,
      };
    });

    const parents = relatedOrganizations.filter(
      (relatedOrganization: any) =>
        relatedOrganization.organization.id === organization_id &&
        relatedOrganization.type === 'parent'
    );

    const parentIds = parents.map((parent: any) => parent.related.id);
    let sisters: any = await this.getSiblings(organization_id, parentIds);

    sisters = sisters.map((sister: any) => {
      return {
        id: sister.id,
        type: sister.type,
        calculated_type: 'sister',
        related_organization_id: sister.organization.id,
        related_organization_name: sister.organization.name,
      };
    });

    relationships = [...relationships, ...sisters];

    return relationships;
  }

  async delete(id: string) {
    const organization = await RelatedOrganization.findByPk(id);
    return organization?.update({ deleted_on: new Date() });
  }
}

export class AdminRelatedOrganizationService extends RelatedOrganizationService {
  getContextQuery() {
    return {};
  }
}

export class OwnerRelatedOrganizationService extends RelatedOrganizationService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export class UserRelatedOrganizationService extends RelatedOrganizationService {
  getContextQuery() {
    return {
      tenant_id: this.user.tenant,
    };
  }
}

export function RelatedOrganizationServiceFactory(user: AuthUser) {
  if (user?.auth?.isAdmin) {
    return new AdminRelatedOrganizationService(RelatedOrganization, user);
  } else if (user?.auth?.isOwner) {
    return new OwnerRelatedOrganizationService(RelatedOrganization, user);
  }
  return new UserRelatedOrganizationService(RelatedOrganization, user);
}
