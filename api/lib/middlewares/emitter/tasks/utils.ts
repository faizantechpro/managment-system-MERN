import { AuthUser } from 'lib/middlewares/auth';
import {
  contactServiceFactory,
  DealFollowerService,
  dealServiceFactory,
  organizationServiceFactory,
  userServiceFactory,
} from 'lib/services';
import ParseSequelizeResponse from 'lib/utils/parseSequelizeResponse';

import { filterUsersBySetting } from './settingsValidator';

export const getEmails = (to: string | string[]) => {
  return typeof to === 'string' ? to : to.join(',');
};

export const extractService = (type: string) => {
  switch (type.toLowerCase()) {
    case 'deals':
    case 'deal':
      return dealServiceFactory({} as any);
    case 'organizations':
    case 'organization':
      // TODO user context not required for Mail usage but provided it in future
      return organizationServiceFactory({} as any);
    case 'contacts':
    case 'contact':
      // TODO user context not required for Mail usage but provided it in future
      return contactServiceFactory({} as any);

    default:
      return undefined;
  }
};

export const getResourceInfo = async (type: string, resourceId: string) => {
  const service = extractService(type);
  if (!service) {
    return;
  }
  const info = await service.getBasicInfo(resourceId);
  return {
    ...info,
    name: info.name || [info.first_name, info.last_name].join(' '),
  };
};

export const getUrl = (
  type: Lowercase<`${'contact' | 'deal' | 'organization'}${'s' | ''}`> | '',
  id: string
) => {
  const path = process.env.PUBLIC_URL;
  switch (type.toLowerCase()) {
    // todo revisit this. there was no proper typing...
    // todo FE paths should not be stored in backend... revisit these hardcoded paths
    case 'organizations':
    case 'organization':
      return `${path}/contacts/${id}/organization/profile`;
    case 'contacts':
    case 'contact':
      return `${path}/contacts/${id}/profile`;
    case 'deals':
    case 'deal':
      return `${path}/deals/${id}`;
    default:
      return '';
  }
};

export const getUserInfo = async (tenant: string, userId: string) => {
  const userService = userServiceFactory({ tenant } as any);
  const user = await userService.getUser(userId);
  return user!.toJSON();
};

const validateEmail = (mail = '') => {
  const regexValidateEmail =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (mail === '' || !regexValidateEmail.test(mail)) return false;
  return true;
};

export const getAttendeesInfo = async (attendees: Array<string>) => {
  const userService = userServiceFactory({} as any);

  const attendeesEmails = attendees
    .filter((item) => validateEmail(item))
    .map((item) => ({ email: item, name: item }));
  const newIds = attendees.filter((item) => !validateEmail(item));

  const guests = await userService.getGuestByIds(newIds);
  const { contacts, users } = ParseSequelizeResponse(guests);
  const validUsers = await filterUsersBySetting(users, 'activityGuests');

  const info = [...contacts, ...validUsers, ...attendeesEmails].map((item) => ({
    name: item?.name || `${item?.first_name} ${item?.last_name}`,
    email:
      item?.email ||
      item?.email_work ||
      item?.email_other ||
      item?.email_home ||
      item?.email_mobile,
    role: 'OPT-PARTICIPANT',
  }));

  const emails = info.map((item) => item.email);
  return {
    emails,
    attendees: info,
  };
};

export const extractComment = (comment: any) => {
  return comment?.blocks?.reduce((prev: string, cur: any) => {
    return `${prev} ${cur.text}`;
  }, '');
};

export const extractMentions = (
  comment: any,
  previousComment: any = undefined
) => {
  const mentions = Object.values(comment?.entityMap)?.map((mention: any) => {
    return mention?.data?.mention;
  });

  if (previousComment) {
    const previousMentions = Object.values(previousComment?.entityMap)?.map(
      (mention: any) => {
        return mention?.data?.mention;
      }
    );

    const diffMentions = mentions.filter((mention: any) => {
      const findMention = previousMentions.find((prevMention: any) => {
        return prevMention?.id === mention?.id;
      });
      return !findMention;
    });

    return diffMentions;
  }

  return mentions;
};

export const extractEmailFromUser = (users: Array<any>) => {
  return users.map((user: any) => user?.email);
};

export const getDealFollowers = async (dealId: string, user: AuthUser) => {
  const service = new DealFollowerService(user);
  const followers = await service.getFollowers(dealId, {
    page: 1,
    limit: 1000,
  });
  return followers?.data?.map((follower: any) => {
    return follower?.user;
  });
};

export const getDealOwners = async (resourceId: string) => {
  const dealService = dealServiceFactory({} as any);
  const aditionalOwnersInfo = await dealService.getAdditionalOwnerInfo(
    resourceId
  );

  const dealOwners = aditionalOwnersInfo?.map((owner: any) => {
    return owner?.user;
  });

  return dealOwners;
};
