import { DealsAttributes } from 'lib/database/models/deal';
import { FeedAttributes } from 'lib/database/models/feed';
import { OrganizationAttributes } from 'lib/database/models/organizations';
import { AuthUser } from '../auth';

export type Resource = {
  // TODO revisit this janky type
  resource: Lowercase<`${'contact' | 'deal' | 'organization'}${'s' | ''}`> | '';
  resource_id: string;
};

export type EventFn<T extends EventName> = (
  task: EventTask<T>
) => Promise<void>;

export type EventName = keyof Event;

export type EventTask<T extends EventName = EventName> = Event[T] & {
  event: T;
};

export type Event = {
  ACTIVITY_CREATED: {
    payload: {
      title: string;
      description: string;
      busyStatus: string;
      attendees: string[];
      location?: string;
      start: number[];
      date: Date;
      user_id: string;
      tenant_id: string;
    };
  };
  COMMENT_CREATED: {
    payload: {
      date: Date;
      feed: FeedAttributes;
      // TODO define the correct type representation
      // generic object represent note/comments
      text: any;
      user: AuthUser;
    };
  } & Resource;
  // find better suited name
  // this is new mention...
  COMMENT_UPDATED: {
    payload: {
      date: Date;
      feed: FeedAttributes;
      // TODO define the correct type representation
      // generic object represent note/comments
      previous_text: any;
      text: any;
      user: AuthUser;
    };
  } & Resource;
  DEAL_UPDATED: {
    payload: {
      deal: DealsAttributes;
      feed: FeedAttributes;
      user: AuthUser;
    };
  } & Resource;
  FOLLOWER_ADDED: {
    payload: {
      organization: OrganizationAttributes;
      user: AuthUser;
    };
  };
  NOTE_CREATED: {
    payload: {
      date: Date;
      feed: FeedAttributes;
      // TODO define the correct type representation
      // generic object represent note/comments
      text: any;
      user: AuthUser;
    };
  } & Resource;
  NOTE_UPDATED: {
    payload: {
      date: Date;
      feed: FeedAttributes;
      // TODO define the correct type representation
      // generic object represent note/comments
      previous_text: any;
      text: any;
      user: AuthUser;
    };
  } & Resource;
  OWNER_ADDED: {
    payload: {
      tenant_id: string;
      user_id: string;
    };
  } & Resource;
  REMINDER_CREATED: {
    payload: {
      activities: any[];
      tenant_id: string;
      user_id: string;
    };
  };
};
