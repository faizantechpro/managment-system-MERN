import { EventEmitter2 } from 'eventemitter2';
import {
  sendActivityCreatedEmail,
  sendCommentCreatedEmail,
  sendDealUpdatedEmail,
  sendFollowingEmail,
  sendMentionEmail,
  sendOwnerAddedEmail,
  sendReminderCreatedEmail,
} from './tasks';
import { EventFn, EventName, EventTask } from './types';

export function initSubscriptions(emitter: EventEmitter2) {
  emitter.on('app.events', async (task: EventTask) => {
    const taskFns = subscriptions[task.event];

    await Promise.all(
      taskFns.map((taskFn) => {
        return taskFn(task as any);
      })
    );
  });
}

const subscriptions: {
  [T in EventName]: EventFn<T>[];
} = {
  ACTIVITY_CREATED: [sendActivityCreatedEmail],
  COMMENT_CREATED: [sendCommentCreatedEmail, sendMentionEmail],
  COMMENT_UPDATED: [sendMentionEmail],
  DEAL_UPDATED: [sendDealUpdatedEmail],
  FOLLOWER_ADDED: [sendFollowingEmail],
  NOTE_CREATED: [sendMentionEmail],
  NOTE_UPDATED: [sendMentionEmail],
  OWNER_ADDED: [sendOwnerAddedEmail],
  REMINDER_CREATED: [sendReminderCreatedEmail],
};
