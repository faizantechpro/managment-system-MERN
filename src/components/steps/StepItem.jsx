import React from 'react';
import { Link } from 'react-router-dom';

import FeedNote from './feedTypes/FeedNote';
import FeedFile from './feedTypes/FeedFile';
import FeedFileDeleted from './feedTypes/FeedFileDeleted';
import FeedDeletion from './feedTypes/FeedDeletion';
import FeedActivity from './feedTypes/FeedActivity';
import FeedCreation from './feedTypes/FeedCreation';
import FeedUpdated from './feedTypes/FeedUpdated';
import FeedLinked from './feedTypes/FeedLinked';
import { setDateFormat } from '../../utils/Utils';
import routes from '../../utils/routes.json';
import {
  ACTIVITY_FEED_TYPES,
  ACTIVITY_FEED_THEMES,
} from '../../utils/constants';
import Comments from './Comments';
import FeedReport from './feedTypes/FeedReport';
import FeedLesson from './feedTypes/FeedLesson';
import FeedCourse from './feedTypes/FeedCourse';

const ResourceLink = ({ data }) => {
  if (data?.deal) {
    return (
      <>
        <span className="mx-1">&bull;</span>
        <Link
          to={`${routes.dealsPipeline}/${data.deal_id}`}
          className="text-block"
        >
          <span>{data?.deal?.name}</span>
        </Link>
      </>
    );
  } else if (data?.contact) {
    return (
      <>
        <span className="mx-1">&bull;</span>
        <Link
          to={`${routes.contacts}/${data.contact_id}/profile`}
          className="text-block"
        >
          <span>{`${data?.contact?.first_name} ${data?.contact?.last_name}`}</span>
        </Link>
      </>
    );
  } else if (data?.organization) {
    return (
      <>
        <span className="mx-1">&bull;</span>
        <Link
          to={`/contacts/${data.organization_id}/organization/profile`}
          className="text-block"
        >
          <span>{data?.organization?.name}</span>
        </Link>
      </>
    );
  }
  return null;
};

const StepItem = ({
  data,
  isDeal,
  feedId,
  isContact,
  setRefreshRecentFiles,
  getProfileInfo,
  ids,
  deal,
  organization,
  organizationId,
  me,
}) => {
  const isOwner =
    me?.roleInfo?.admin_access ||
    me?.roleInfo?.owner_access ||
    data?.created_by === me?.id;

  const renderContent = (type, objectData, id, activity_id) => {
    switch (type) {
      case ACTIVITY_FEED_TYPES.note:
        return (
          <FeedNote
            data={objectData}
            feedId={feedId}
            getProfileInfo={getProfileInfo}
            isOwner={isOwner}
          />
        );

      case ACTIVITY_FEED_TYPES.file:
        return (
          <FeedFile
            data={objectData}
            setRefreshRecentFiles={setRefreshRecentFiles}
            organizationId={organizationId}
            isOwner={isOwner}
          />
        );

      case ACTIVITY_FEED_TYPES.fileDeleted:
        return <FeedFileDeleted data={objectData} />;

      case ACTIVITY_FEED_TYPES.deletion:
        return <FeedDeletion data={objectData} />;

      case ACTIVITY_FEED_TYPES.report:
        return <FeedReport data={objectData} organizationId={organizationId} />;

      case ACTIVITY_FEED_TYPES.call:
      case ACTIVITY_FEED_TYPES.meeting:
      case ACTIVITY_FEED_TYPES.task:
      case ACTIVITY_FEED_TYPES.deadline:
      case ACTIVITY_FEED_TYPES.email:
      case ACTIVITY_FEED_TYPES.lunch:
        return (
          <FeedActivity
            data={objectData}
            id={id}
            isContact={isContact}
            getProfileInfo={getProfileInfo}
            ids={ids}
            deal={deal}
            organization={organization}
            activity_id={activity_id}
            isOwner={isOwner}
            feedInfo={data}
          />
        );

      case ACTIVITY_FEED_TYPES.creation:
        return <FeedCreation {...objectData} isDeal={isDeal} />;

      case ACTIVITY_FEED_TYPES.updated:
        return <FeedUpdated {...objectData} />;

      case ACTIVITY_FEED_TYPES.contactLinked:
      case ACTIVITY_FEED_TYPES.contactUnlinked:
        return (
          <FeedLinked
            data={objectData}
            profileUrl={`${routes.contacts}/${objectData.id}/profile`}
          />
        );

      case ACTIVITY_FEED_TYPES.organizationLinked:
      case ACTIVITY_FEED_TYPES.organizationUnlinked:
        return (
          <FeedLinked
            data={objectData}
            profileUrl={`/contacts/${objectData.id}/organization/profile`}
          />
        );

      case ACTIVITY_FEED_TYPES.lessonCompleted:
      case ACTIVITY_FEED_TYPES.lessonStarted:
        return <FeedLesson data={objectData} />;

      case ACTIVITY_FEED_TYPES.courseCompleted:
      case ACTIVITY_FEED_TYPES.courseStarted:
        return <FeedCourse data={objectData} />;

      default:
        return null;
    }
  };

  const getSummary = (summaryInfo) => {
    const { name } = summaryInfo.object_data;
    if (
      !isDeal &&
      summaryInfo?.deal_id &&
      summaryInfo.type === ACTIVITY_FEED_TYPES.updated
    ) {
      return (
        <span>
          Your deal
          <Link
            to={`${routes.pipeline}/${summaryInfo.deal_id}`}
            className="text-block"
          >
            {` "${name}" `}
          </Link>
          {summaryInfo.summary === 'Deal updated'
            ? 'was updated'
            : summaryInfo.summary}
        </span>
      );
    }
    return <span>{summaryInfo.summary}</span>;
  };

  let stepItemDate;
  const getHoursDifference = () => {
    const dif = now.getHours() - stepItemDate.getHours();
    return dif === 0
      ? 'Just Now'
      : dif === 1
      ? 'An hour ago'
      : `${dif} hours ago`;
  };
  const getNearTimeDifference = () => {
    return (
      now.getFullYear === stepItemDate.getFullYear &&
      now.getMonth() === stepItemDate.getMonth() &&
      (now.getDate() === stepItemDate.getDate()
        ? getHoursDifference()
        : now.getDate() - 1 === stepItemDate.getDate() &&
          now.getHours() - stepItemDate.getHours() < 2 &&
          'One day ago')
    );
  };

  const updateStepItemDate = (date) => {
    stepItemDate = new Date(date);
  };
  const now = new Date();

  return (
    <li className="step-item">
      <div className="step-content-wrapper">
        <span
          className={`step-icon ${ACTIVITY_FEED_THEMES[data?.type]?.color}`}
        >
          <i className="material-icons-outlined">
            {ACTIVITY_FEED_THEMES[data?.type]?.icon}
          </i>
        </span>

        <div className="step-content">
          <h5>{getSummary(data)}</h5>
          <p className="step-text font-size-xs text-muted">
            {updateStepItemDate(data.updated_at)}
            <span>
              {getNearTimeDifference() ||
                setDateFormat(data.updated_at, 'MMM DD YYYY h:mm A')}
            </span>
            <span className="mx-1">&bull;</span>
            {data?.created_by && (
              <Link
                to={`${routes.usersProfile}/${data?.created_by}`}
                className="text-block"
              >
                <span>{`${data?.created_by_info?.first_name || ''} `}</span>
                <span>{data?.created_by_info?.last_name || ''}</span>
              </Link>
            )}
            {data?.updated_by_info && (
              <>
                <span className="mx-1">&bull; Last updated by</span>
                <Link
                  to={`${routes.usersProfile}/${data?.created_by}`}
                  className="text-block"
                >
                  <span>{`${data?.updated_by_info?.first_name || ''} `}</span>
                  <span>{data?.updated_by_info?.last_name || ''}</span>
                </Link>
              </>
            )}
            {/* {organization && (
              <>
                <span className="mx-1">&bull;</span>
                <Link
                  to={`/contacts/${organization.id}/organization/profile`}
                  className="text-block"
                >
                  <span>{`${organization.name || ''} `}</span>
                </Link>
              </>
            )} */}
            <ResourceLink data={data} />
          </p>
          {renderContent(
            data.type,
            data.object_data,
            data.id,
            data.activity_id
          )}
          <Comments data={data} me={me} />
        </div>
      </div>
    </li>
  );
};

StepItem.defaultProps = {
  showOrganizationInfo: false,
  isDeal: false,
  isContact: false,
  isOrganization: false,
};

export default StepItem;
