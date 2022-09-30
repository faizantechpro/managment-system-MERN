import { NotificationSettings } from '../database';
import ParseSequelizeResponse from 'lib/utils/parseSequelizeResponse';
import { WhereOptions } from 'sequelize';
import { UserContext } from '../middlewares/openapi';

export class NotificationService {
  static async addSettings(user: UserContext, data: any) {
    const result = await NotificationSettings.upsert(
      {
        tenant_id: user.tenant,
        user_id: user.id,
        settings: data,
      },
      {
        returning: true,
      }
    );

    return ParseSequelizeResponse(result);
  }

  static async getSettings(filter: any) {
    const where: WhereOptions = {
      ...filter,
    };

    const foundSettings = await NotificationSettings.findAll({
      where,
    });

    return ParseSequelizeResponse(foundSettings);
  }

  static async getSettingsByUserId(userId: string) {
    const foundSettings = await NotificationSettings.findOne({
      where: { user_id: userId },
    });

    if (!foundSettings) {
      return null;
    }

    return ParseSequelizeResponse(foundSettings);
  }
}
