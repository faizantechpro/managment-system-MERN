import { Op, WhereOptions } from 'sequelize';

import ParseSequelizeResponse from 'lib/utils/parseSequelizeResponse';
import { v4 as uuidv4 } from 'uuid';

import { Tenant } from '../database';
import { Pagination } from '../types/items';
import { storage } from 'lib/storage';
import { FilesService } from './files';

export class TenantService {
  static async getTenantById(id: string) {
    const result = await Tenant.findByPk(id);
    return ParseSequelizeResponse(result);
  }

  static async getByLogo(logo: string) {
    const result = await Tenant.findOne({
      where: {
        [Op.or]: [
          {
            logo,
          },
          {
            icon: logo,
          },
        ],
      },
    });
    return result?.toJSON();
  }

  static async getAllTenants(pagination: Pagination) {
    const { limit, page, search } = pagination;

    const where: WhereOptions = {};

    if (search) {
      where['name'] = { [Op.iLike]: `%${search}%` };
    }
    const result = await Tenant.findAndCountAll({
      where,
      limit: limit,
      offset: limit * (page - 1),
      order: [['created_at', 'DESC']],
    });

    return {
      data: result.rows.map((row) => row.toJSON()) as any,
      pagination: {
        limit: Number(limit),
        page: Number(page),
        totalPages: Math.ceil(result.count / limit),
        count: result.count,
      },
    };
  }

  static async getTenantBySubdomain(domain: string) {
    const result = await Tenant.findOne({
      where: {
        domain,
      },
    });
    return result?.toJSON();
  }

  static async updateTenant(id: string, data: any) {
    await Tenant.update(data, { where: { id } });
    return {};
  }

  static async createTenant(data: any) {
    const id = uuidv4();
    const body = {
      id,
      ...data,
    };

    const result = await Tenant.create(body);

    return result.toJSON();
  }

  static async getMailThemeData(tenantId: string) {
    let logoUrl = '';
    const result = await Tenant.findByPk(tenantId);

    const tenant = ParseSequelizeResponse(result);
    const fileService = new FilesService();
    if (tenant?.logo && tenant?.icon) {
      const avatar = tenant?.use_logo
        ? tenant?.logo
          ? tenant?.logo
          : tenant?.icon
        : tenant?.icon;
      const file = await fileService.readOne(avatar);
      const disk = storage.disk(file.storage);
      const { signedUrl } = await disk.getSignedUrl(file?.filename_disk || '');
      logoUrl = signedUrl;
    }
    return {
      projectName: tenant?.name,
      projectUrl: `https://${tenant?.domain}`,
      projectLogo: logoUrl,
      projectColor: tenant?.colors?.primaryColor,
    };
  }
}
