import { NotificationService } from 'lib/services';

async function userHasSetting(userId: string, setting: string) {
  const settings = await NotificationService.getSettingsByUserId(userId);
  return !!settings?.settings?.[setting];
}

export const settingsValidator = async (userId: string, setting: string) => {
  const hasSetting = await userHasSetting(userId, setting);
  if (!hasSetting) {
    throw new Error('Settings not found');
  }
};

export const filterUsersBySetting = async (
  users: Array<any>,
  setting: string
) => {
  // may not be needed.. left over from no proper type usage
  let validUsers = users.filter((user) => !!user);

  validUsers = await Promise.all(
    validUsers.map(async (user) => ({
      ...user,
      hasSetting: await userHasSetting(user.id, setting),
    }))
  );

  return validUsers.filter(({ hasSetting }) => hasSetting);
};
