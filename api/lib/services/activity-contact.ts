import { ActivityContacts } from 'lib/database';
import { ActivityContactModel } from 'lib/database/models/activity-contacts';
import { AuthUser } from 'lib/middlewares/auth';
import Base from './utils/Base';

class ActivityContactService extends Base<ActivityContactModel> {
  async getByActivityId(activityId: string) {
    const ActivityContact = await ActivityContacts.findAll({
      attributes: [],
      include: ['contact'],
      where: { activity_id: activityId },
    });

    const data = ActivityContact.filter((item: any) => item?.contact).map(
      (item: any) => item?.contact
    );

    return this.rowsToJSON(data);
  }
}

export function activityContactServiceFactory(user: AuthUser) {
  return new ActivityContactService(ActivityContacts, user);
}
