export const FEEDTABS = [
  {
    type: '',
    label: 'All',
  },
  {
    type: ['note'],
    label: 'Notes',
  },
  {
    type: [
      'emailActivity',
      'taskActivity',
      'lunchActivity',
      'meetingActivity',
      'deadlineActivity',
      'callActivity',
    ],
    label: 'Activities',
  },
  {
    type: ['file', 'fileDeleted'],
    label: 'Files',
  },
  {
    type: [
      'updated',
      'courseCompleted',
      'test',
      'lessonCompleted',
      'courseStarted',
      'organizationUnlinked',
      'field',
      'creation',
      'contactLinked',
      'report',
      'lessonStarted',
      'contactUnlinked',
      'organization_field',
      'deletion',
      'organizationLinked',
    ],
    label: 'ChangeLog',
  },
];

export const defaultTenantId = 'cacadeee-0000-4000-a000-000000000000';

export enum FISERV_PATHS {
  FUNDING_SEARCH = '/reporting/v1/funding/search',
  SETTLEMENT_SUMMARY = '/reporting/v1/settlement/summary',
  FUNDING_SUMMARY = '/reporting/v1/funding/summary',
  AUTHORIZATION_SUMMARY = '/reporting/v1/authorization/summary',
  AUTHORIZATION_SEARCH = '/reporting/v1/authorization/search',
  CHARGEBACKS_SUMMARY = '/reporting/v1/chargeback/summary',
  CHARGEBACKS_SEARCH = '/reporting/v1/chargeback/search',
}
