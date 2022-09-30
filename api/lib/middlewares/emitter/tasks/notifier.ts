import moment from 'moment';
import { EventTask } from 'lib/middlewares/emitter';

import {
  getEmails,
  getResourceInfo,
  getUserInfo,
  getUrl,
  extractComment,
  getDealFollowers,
  getDealOwners,
  extractMentions,
  getAttendeesInfo,
  extractEmailFromUser,
} from './utils';
import { MailService } from '../../../services/mail/index';
import { settingsValidator, filterUsersBySetting } from './settingsValidator';
import { removeDuplicate } from 'lib/utils/utils';
import { TenantService } from 'lib/services';

const mailService = new MailService();

export const sendOwnerAddedEmail = async ({
  resource,
  resource_id,
  payload,
}: EventTask<'OWNER_ADDED'>) => {
  try {
    await settingsValidator(payload.user_id, 'associations');
    const resourceId = resource_id;
    const result = await getResourceInfo(resource, resourceId);
    const user = await getUserInfo(payload.tenant_id, payload.user_id);
    const tplData = await TenantService.getMailThemeData(payload.tenant_id);

    await mailService.send({
      tenant_id: payload.tenant_id,
      bcc: user.email,
      subject: `You were assigned to a new ${resource}`,
      template: {
        name: 'assigned-to',
        data: {
          ...tplData,
          type: resource,
          name: result.name,
          url: getUrl(resource, resourceId),
        },
      },
    });
  } catch (error) {
    console.log('Error in sending email', error);
  }
};

export const sendCommentCreatedEmail = async ({
  resource,
  resource_id,
  payload,
}: EventTask<'COMMENT_CREATED'>) => {
  try {
    const comment = extractComment(payload.text);
    const [tplData, feedUser, result, user] = await Promise.all([
      TenantService.getMailThemeData(payload.user.tenant),
      getUserInfo(payload.user.tenant, payload.feed.created_by),
      getResourceInfo(resource, resource_id),
      getUserInfo(payload.user.tenant, payload.user.id),
    ]);

    await settingsValidator(feedUser.id, 'mentionsAndComments');
    await mailService.send({
      tenant_id: payload.user.tenant,
      bcc: getEmails(feedUser.email),
      subject: `You have a new comment in the ${resource}: ${result.name}`,
      template: {
        name: 'new-comment',
        data: {
          ...tplData,
          url: getUrl(resource, resource_id),
          first_name: user?.first_name,
          last_name: user?.last_name,
          comment,
          date: moment(payload.date).format('MMM DD YYYY h:mm A'),
        },
      },
    });

    // emit new mention
  } catch (error) {
    console.log('Error in sending email', error);
  }
};

export const sendMentionEmail = async ({
  resource,
  resource_id,
  payload,
}: EventTask<
  'COMMENT_CREATED' | 'COMMENT_UPDATED' | 'NOTE_CREATED' | 'NOTE_UPDATED'
>) => {
  let mentions;
  if ('previous_text' in payload) {
    mentions = extractMentions(payload.text, payload.previous_text);
  } else {
    mentions = extractMentions(payload.text);
  }

  const validUsers = await filterUsersBySetting(
    mentions,
    'mentionsAndComments'
  );
  const mentionEmails = extractEmailFromUser(validUsers);

  const comment = extractComment(payload.text);
  const [feedUser, result, user] = await Promise.all([
    getUserInfo(payload.user.tenant, payload.feed.created_by),
    getResourceInfo(resource, resource_id),
    getUserInfo(payload.user.tenant, payload.user.id),
  ]);

  const mentionEmailsWithoutUser = mentionEmails.filter(
    (email) => email !== feedUser.email
  );

  const tplData = await TenantService.getMailThemeData(payload.user.tenant);

  if (mentionEmailsWithoutUser.length > 0) {
    await mailService.send({
      tenant_id: payload.user.tenant,
      bcc: getEmails(mentionEmails),
      subject: `You have a new mention in the ${resource}: ${result.name}`,
      template: {
        name: 'new-mention',
        data: {
          ...tplData,
          url: getUrl(resource, resource_id),
          first_name: user.first_name,
          last_name: user.last_name,
          comment,
          date: moment(payload.date).format('MMM DD YYYY h:mm A'),
        },
      },
    });
  }
};

export const sendDealUpdatedEmail = async ({
  resource,
  resource_id,
  payload,
}: EventTask<'DEAL_UPDATED'>) => {
  const data = payload.feed.object_data;
  const followers = await getDealFollowers(resource_id, payload.user);
  const owners = await getDealOwners(resource_id);
  const primaryOwnerEmail = await getUserInfo(
    payload.user.tenant,
    // TODO revisit due to improper type usage in the past
    payload.deal.assigned_user_id!
  );
  const validUsers = await filterUsersBySetting(
    [...followers, ...owners, primaryOwnerEmail],
    'dealsUpdates'
  );
  const emails = removeDuplicate(extractEmailFromUser(validUsers));
  const tplData = await TenantService.getMailThemeData(payload.user.tenant);

  await mailService.send({
    tenant_id: payload.user.tenant,
    bcc: emails,
    subject: `New changes to your deal ${data.name}`,
    template: {
      name: 'deal-updates',
      data: {
        ...tplData,
        types: {
          deal_type: 'Status',
          amount: 'Value',
          email_home: 'Email (Home)',
          email_work: 'Email (Work)',
          email_other: 'Email (Other)',
          phone_home: 'Phone (Home)',
          phone_work: 'Phone (Work)',
          phone_mobile: 'Phone (Mobile)',
          phone_other: 'Phone (Other)',
          name: 'Title',
        },
        updates: data.updates,
        name: data.name,
        url: getUrl(resource, resource_id),
      },
    },
  });
};

export const sendActivityCreatedEmail = async ({
  payload,
}: EventTask<'ACTIVITY_CREATED'>) => {
  const {
    title,
    description,
    busyStatus,
    attendees,
    start,
    date,
    location,
    user_id,
    tenant_id,
  } = payload;
  const user = await getUserInfo(tenant_id, user_id);
  const attendeesInfo = await getAttendeesInfo(attendees);

  const organizer = {
    name: `${user?.first_name} ${user?.last_name}`,
    email: user.email,
  };

  const tplData = await TenantService.getMailThemeData(tenant_id);

  // TODO investigate this..
  const ics = require('ics');
  ics.createEvent(
    {
      title,
      description,
      busyStatus,
      start,
      organizer,
      attendees: [organizer, ...attendeesInfo.attendees],
      // duration: { minutes: 60 },
    },
    async (error: any, value: any) => {
      if (error) {
        console.log(error);
      }

      await mailService.send({
        tenant_id: payload?.tenant_id,
        to: removeDuplicate(attendeesInfo.emails),
        subject: `Invitation: ${title}`,
        attachments: [
          {
            filename: 'event.ics',
            content: value,
          },
        ],
        template: {
          name: 'event',
          data: {
            ...tplData,
            title,
            date,
            description,
            location,
            emails: removeDuplicate(attendeesInfo.emails),
          },
        },
      });
    }
  );
};

export const sendReminderCreatedEmail = async ({
  payload,
}: EventTask<'REMINDER_CREATED'>) => {
  const user = await getUserInfo(payload.tenant_id, payload.user_id);
  const tplData = await TenantService.getMailThemeData(payload.tenant_id);

  await mailService.send({
    tenant_id: payload.tenant_id,
    to: user.email,
    subject: `Activities scheduled for the day`,
    template: {
      name: 'reminder',
      data: {
        ...tplData,
        name: user.first_name,
        activities: payload.activities,
      },
    },
  });
};

export async function sendFollowingEmail(task: EventTask<'FOLLOWER_ADDED'>) {
  try {
    const { payload } = task;

    const [user, primaryOwner, tplData] = await Promise.all([
      getUserInfo(payload.user.tenant, payload.user.id),
      getUserInfo(
        payload.organization.tenant_id,
        payload.organization.assigned_user_id
      ),
      TenantService.getMailThemeData(payload.user.tenant),
    ]);

    await mailService.send({
      tenant_id: payload.user.tenant,
      bcc: user.email,
      subject: 'You are following a new organization',
      template: {
        name: 'new-follow',
        data: {
          ...tplData,
          resource: {
            name: payload.organization.name,
            type: 'organization',
            url: getUrl('organization', payload.organization.id),
            primaryOwner: {
              name: `${primaryOwner.first_name || ''} ${
                primaryOwner.last_name || ''
              }`,
            },
          },
        },
      },
    });
  } catch (error) {
    console.log('Error sending email', error);
  }
}
