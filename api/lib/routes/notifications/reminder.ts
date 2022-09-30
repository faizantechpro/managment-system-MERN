import { NotificationSettingsAttributes as SettingsAttributes } from 'lib/database/models/notification-settings';
import {
  generateJSONBase,
  generateResponseSchema,
  operationMiddleware,
} from 'lib/middlewares/openapi';
import { activityServiceFactory, NotificationService } from 'lib/services';
import moment from 'moment';

type SettingInfo = Array<SettingsAttributes>;

const getSettings = async (dateTime: string) => {
  const [settings, settingsRealTime, settingsCustomTime] = await Promise.all([
    NotificationService.getSettings({
      settings: { remindTime: dateTime, remindMyActivities: true },
    }),
    NotificationService.getSettings({
      settings: { remindTime: '', remindMyActivities: true },
    }),
    NotificationService.getSettings({
      settings: { remindTime: 'custom', remindMyActivities: true },
    }),
  ]);

  return { settings, settingsRealTime, settingsCustomTime };
};

const sendReminders = async (
  settings: SettingInfo,
  date: string,
  addTime: any
) => {
  const dateFormat = 'YYYY-MM-DD HH:mm';
  const dateFrom = moment(date).format(dateFormat);

  if (settings?.length > 0) {
    settings.forEach(async ({ settings, user_id, tenant_id }) => {
      const add =
        settings.remindTime !== 'custom' ? addTime : settings.customRemindTime;
      const dateTo = moment(date).add(add.amount, add.unit).format(dateFormat);

      const activityService = activityServiceFactory({
        id: user_id,
        tenant: tenant_id,
      } as any);
      await activityService.sendActivitiesReminder(dateFrom, dateTo);
    });
  }
};

export const POST = operationMiddleware(
  'sendReminder',
  {
    operationId: 'sendReminder',
    summary: 'Send Reminder',
    tags: ['notifications'],
    security: [{ Basic: [] }],
    parameters: [],
    requestBody: {
      required: true,
      ...generateJSONBase({
        type: 'object',
        required: ['date'],
        additionalProperties: true,
        properties: {
          date: {
            type: 'string',
          },
        },
      }),
    },
    responses: {
      200: generateResponseSchema({
        type: 'object',
      }),
    },
  },

  async (req, res) => {
    const { date } = req.body;
    const dateTime = moment(date).format('HH:mm');

    const { settings, settingsRealTime, settingsCustomTime } =
      await getSettings(dateTime);

    if (
      settings?.length === 0 &&
      settingsRealTime?.length === 0 &&
      settingsCustomTime?.length === 0
    ) {
      return res.status(404).json({ error: 'No settings found' });
    }

    await sendReminders(settings, date, { amount: 1, unit: 'days' });
    await sendReminders(settingsRealTime, date, {
      amount: 15,
      unit: 'minutes',
    });
    await sendReminders(settingsCustomTime, date, {});

    return res.json({});
  }
);
