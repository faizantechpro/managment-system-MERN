import React, { useEffect, useState } from 'react';

import StepItem from './StepItem';
import feedService from '../../services/feed.service';
import AlertWrapper from '../Alert/AlertWrapper';
import Alert from '../Alert/Alert';
import { Modal } from 'react-bootstrap';
import AddActivity from '../peopleProfile/contentFeed/AddActivity';
const InitialTabs = [
  {
    tabId: 1,
    type: '',
    label: 'All',
  },
  {
    tabId: 2,
    type: ['note'],
    label: 'Notes',
  },
  {
    tabId: 3,
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
    tabId: 4,
    type: ['file', 'fileDeleted'],
    label: 'Files',
  },
  {
    tabId: 5,
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

const Steps = ({
  fetchAll,
  contactId,
  organizationId,
  dealId,
  userId,
  isDeal,
  getProfileInfo,
  setRefreshRecentFiles,
  openActivityId,
  limit = 25,
  me,
}) => {
  const [activityFeed, setActivityFeed] = useState([]);
  const [activityData, setActivityData] = useState({});
  const [activityFeedPlaned, setActivityFeedPlaned] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [showModalActivity, setShowModalActivity] = useState(false);

  const [paginationPlaned, setPaginationPlaned] = useState({
    page: 1,
    limit: 5,
  });
  const [activeTab, setActiveTab] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [tabs, setTabs] = useState(InitialTabs);

  const getActivityFeed = async (
    type = '',
    page = pagination.page,
    total = pagination.limit,
    done = true
  ) => {
    const params = { contactId, organizationId, dealId, userId, type };

    if (type === tabs[2].type) {
      params.done = done;
      if (!done) {
        params.orderBy = 'created_at';
        params.typeOrder = 'DESC';
      }
    }

    if (type === '') {
      params.noPlaned = true;
    }

    try {
      const result = await feedService.getActivityFeed(params, {
        page,
        limit: total,
      });

      if (done) {
        setActivityFeed(result.feed);
        setPagination(result.pagination);
      } else {
        setActivityFeedPlaned(result.feed);
        setPaginationPlaned(result.pagination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getActivityById = async (activityId) => {
    try {
      const result = await feedService.getFeedActivity(activityId);
      setActivityData(result);
      setShowModalActivity(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getTaps = async () => {
    try {
      const params = { contactId, organizationId, dealId, userId };
      const result = await feedService.getTapsTypes(params);
      const tabsBlocks = [];

      result.forEach(({ count, label }) => {
        const tab = tabs.find((tab) => tab.label === label);
        tabsBlocks.push({ ...tab, disabled: count === 0 });
      });

      setTabs(tabsBlocks);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (fetchAll || contactId || organizationId || dealId || userId) {
      getActivityFeed(
        tabs[2].type,
        paginationPlaned.page,
        paginationPlaned.limit,
        false
      );
      getActivityFeed();
      getTaps();
    }
  }, [contactId, organizationId, dealId, userId]);

  useEffect(() => {
    if (openActivityId) {
      getActivityById(openActivityId);
    }
  }, [openActivityId]);

  const onHandleGetInfoFeed = async (message) => {
    await getActivityFeed(
      tabs[2].type,
      paginationPlaned.page,
      paginationPlaned.limit,
      false
    );
    await getActivityFeed();
    setActiveTab(1);

    if (message) setSuccessMessage(message);
  };

  const renderStepItemContent = (typeFeed, activities, paginationData) => {
    return (
      <div>
        {activities?.length > 0 && (
          <ul className="step step-icon-sm mt-5">
            {activities.map((item) => (
              <StepItem
                key={item.id}
                feedId={item.id}
                getProfileInfo={getProfileInfo || onHandleGetInfoFeed}
                data={item}
                isDeal={isDeal}
                setRefreshRecentFiles={setRefreshRecentFiles}
                ids={{ contactId, organizationId, dealId }}
                deal={item.deal}
                organization={item.organization}
                organizationId={organizationId}
                me={me}
              />
            ))}
          </ul>
        )}

        {paginationData?.limit < paginationData?.count && (
          <div className="w-100 d-flex justify-content-center mb-4">
            <button
              className="btn btn-outline-primary px-10"
              onClick={() => onHandleChangePage(typeFeed, paginationData)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    );
  };

  const onHandleChangePage = async (done, paginationData) => {
    const limitPage = done ? limit : 5;

    await getActivityFeed(
      !done ? tabs[2].type : tabs[activeTab - 1].type,
      paginationData.page,
      paginationData.limit + limitPage,
      done
    );
  };

  const onChangeTap = (item) => {
    setActiveTab(item.tabId);
    setPagination({ page: 1, limit });
    getActivityFeed(item.type, 1, limit);
  };

  return (
    <div>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
      </AlertWrapper>

      <Modal
        show={showModalActivity}
        onHide={() => {
          setShowModalActivity(false);
        }}
        className="modal-create-activity"
        size={'lg'}
        animation={false}
      >
        <Modal.Header closeButton />
        <AddActivity
          feedId={activityData?.id}
          componentId="edit-activity"
          contactId={contactId}
          organizationId={organizationId}
          dealId={dealId}
          contactIs={organizationId ? 'organization' : 'profile'}
          getProfileInfo={getProfileInfo || onHandleGetInfoFeed}
          isModal={true}
          closeModal={() => setShowModalActivity(false)}
          activityData={activityData?.object_data}
          feedInfo={activityData}
        />
      </Modal>
      <div>
        <div className="text-center mt-3">
          <span className="badge rounded-pill bg-secondary px-3 py-2 text-light">
            PLANNED
          </span>
        </div>
        {renderStepItemContent(false, activityFeedPlaned, paginationPlaned)}
        {!activityFeedPlaned.length && (
          <div className="text-center py-5">
            <span>There are no upcoming activities.</span>
          </div>
        )}
      </div>

      <div>
        <div className="text-center">
          <span className="badge rounded-pill bg-secondary px-3 py-2 text-light">
            DONE
          </span>
        </div>

        <div
          className={`w-100 d-flex  align-items-baseline justify-content-center`}
        >
          <ul
            className="nav nav-tabs link-active-wrapper nav-sm-down-break mt-4 border-bottom-0"
            role="tablist"
          >
            {tabs.map((item) => {
              const { tabId, label, disabled } = item;
              return (
                <li className="nav-item" key={tabId}>
                  <a
                    className={`nav-link text-uppercase ${
                      activeTab === tabId ? 'active' : ''
                    } ${disabled ? 'disabled text-muted' : ''}`}
                    role="tab"
                    onClick={() => onChangeTap(item)}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {renderStepItemContent(true, activityFeed, pagination)}
        {!activityFeed.length && (
          <div className="text-center pt-5 pb-3">
            <span>There are no activities.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Steps;
