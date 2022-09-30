import React, { useEffect, useReducer, useState, useRef } from 'react';

import ButtonIcon from '../../../components/commons/ButtonIcon';
import Board from '../../../components/deals/Board';
import {
  DEALS_LABEL_BUTTON,
  OWNER,
  SEARCH_FOR_USER,
  FILTER_PEOPLE,
  SEARCH,
  paginationDefault,
  NEW_STAGE_ID,
} from '../../../utils/constants';
import { reducer } from '../../../views/Deals/contacts/utils';
import { initialFilters } from '../../../views/Deals/contacts/Contacts.constants';
import dealService from '../../../services/deal.service';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Alert from '../../../components/Alert/Alert';
import DealList from './DealList';
import Filters from '../../../components/Filters';
import userService from '../../../services/user.service';
import { DataFilters } from '../../../components/DataFilters';
import AddDeal from '../../../components/peopleProfile/deals/AddDeal';
import { sortingTable } from '../../../utils/sortingTable';
import stageService from '../../../services/stage.service';
import MaterialIcon from '../../../components/commons/MaterialIcon';
import Skeleton from 'react-loading-skeleton';
import { usePipelineBoardContext } from '../../../contexts/PipelineBoardContext';
import { Dropdown, Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

const initialFiltersItems = [];

const BoardLoader = ({ count }) => {
  const [loaderCount] = useState(Array(count).fill(0));
  const ColumnLoader = () => {
    return (
      <div className="p-0 mx-1 text-center pipeline-board-edit">
        <Skeleton count={7} height={80} width={230} className="my-2 d-block" />
      </div>
    );
  };
  return (
    <div className="d-flex justify-content-between flex-row w-100 parent-column">
      {loaderCount.map((_, index) => (
        <ColumnLoader key={index} />
      ))}
    </div>
  );
};

const SaveCancelPipelineRow = ({
  togglePipelineEdit,
  onSavePipeline,
  loading,
  refreshBoard,
}) => {
  const handleCancel = () => {
    refreshBoard();
  };

  return (
    <div className="d-flex justify-content-end w-100 align-items-center">
      <button
        value="cancel"
        className="btn btn-sm btn-white mr-2"
        onClick={handleCancel}
      >
        Cancel
      </button>
      <ButtonIcon
        icon="save"
        classnames="btn-sm ml-1 border-0"
        loading={loading}
        label="Save Pipeline"
        onclick={onSavePipeline}
      />
    </div>
  );
};

const Nav = ({ active = false, onclick, togglePipelineEdit }) => {
  return (
    <div className="mx-3">
      <ul className="nav nav-segment p-0" id="leadsTab" role="tablist">
        <li className="nav-item">
          <a
            className={`d-flex align-item-center nav-link ${
              active ? 'active' : ''
            }`}
            id="pipeline-tab"
            data-toggle="tab"
            role="tab"
            aria-controls="pipeline"
            aria-selected="true"
            title="Pipeline view"
            onClick={onclick}
          >
            <i
              className="material-icons-outlined font-size-xxl"
              data-uw-styling-context="true"
            >
              view_column
            </i>
            {active && (
              <>
                <span className="fs-7 font-weight-semi-bold ml-2">
                  Pipeline
                </span>
                <a
                  className="ml-2 link-dark border-left pl-2"
                  onClick={(e) => togglePipelineEdit(e)}
                >
                  <MaterialIcon icon="edit" clazz="text-sm text-gray-700" />
                </a>
              </>
            )}
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${!active ? 'active' : ''}`}
            id="list-tab"
            data-toggle="tab"
            role="tab"
            aria-controls="list"
            aria-selected="false"
            title="List view"
            onClick={onclick}
          >
            <i className="material-icons-outlined font-size-xxl">view_list</i>
          </a>
        </li>
      </ul>
    </div>
  );
};

const Deals = () => {
  const isMounted = useRef(false);
  const [active, setActive] = useState(true);
  const [openDeal, setOpenDeal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [allDeals, setAllDeals] = useState([]);
  const [filtersItems, setFiltersItems] = useState(initialFiltersItems);
  const [filterSelected, setFilterSelected] = useState({ status: 'opened' });
  const [searchTerm, setSearchTerm] = useState({});
  const [pagination, setPagination] = useState({
    page: paginationDefault.page,
  });
  const [paginationData, setPaginationData] = useState({
    page: paginationDefault.page,
  });
  const [addDealBtnLoading, setAddDealBtnLoading] = useState(false);
  const [infoDeals, setInfoDeals] = useState({});
  const [flagDeal, setFlagDeal] = useState([]);
  const [, dispatch] = useReducer(reducer, initialFilters);
  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState([]);
  const [initialDeals, setInitialDeals] = useState({});
  const [listDeals, setListDeals] = useState(initialDeals);
  const [pipelineEdit, setPipelineEdit] = useState(false);
  const [pipelineSaveLoader, setPipeLineSaveLoader] = useState(false);
  const { stages, setStages } = usePipelineBoardContext();
  const [refreshBoardHeader, setRefreshBoardHeader] = useState(1);
  const [selectedStage, setSelectedStage] = useState({});
  const [openFilter, setOpenFilter] = useState(false);
  const [dealFilterTab, setDealFilterTab] = useState('filters');
  const [dealFilterOptionSelected, setDealFilterOptionSelected] = useState({
    id: 4,
    key: 'opened',
    name: 'Open Deals',
  });
  const [me, setMe] = useState(null);
  const [title, setTitle] = useState({
    id: 4,
    key: 'opened',
    name: 'Open Deals',
  });

  const getStageByName = (name) => {
    return stages.find((stage) => stage?.deal_stage.name === name);
  };

  useEffect(async () => {
    const stages = await stageService.getStages();
    const getStages = {};
    stages.forEach((stage) => {
      getStages[stage?.deal_stage?.name] = {
        loading: true,
        id: stage?.id,
        stagePosition: stage?.position,
        name: stage?.deal_stage?.name,
        title: stage?.deal_stage?.name,
      };
    });
    setStages(stages);
    setInitialDeals(getStages);
    setShowLoading(false);
  }, [refreshBoardHeader]);

  useEffect(async () => {
    const me = await userService.getUserInfo().catch((err) => console.log(err));
    setMe(me);
  }, []);

  useEffect(() => {
    onGetUsers();
    onGetDeals(true);
  }, []);

  useEffect(() => {
    if (active) {
      Object.values(initialDeals).forEach((item) => {
        getDeals(
          {
            name: item?.name,
            id: item?.id,
            stagePosition: item?.position || item?.stagePosition,
          },
          paginationDefault.page,
          order
        );
      });
    } else onGetDeals(true);
  }, [active, paginationData, flagDeal, order, initialDeals]);

  useEffect(() => {
    const summary = [];
    Object.keys(listDeals).forEach((key) => {
      if (listDeals[key]?.header?.total_amount) {
        summary.push(listDeals[key]?.header);
      }

      const total = summary?.reduce((acc, data) => {
        return {
          total: (acc.total || 0) + Number(data.total_amount),
          count_deals: (acc.count_deals || 0) + data.total_count,
        };
      }, 0);

      setInfoDeals(total);
    });
  }, [listDeals]);

  async function onGetUsers() {
    const response = await userService
      .getUsers(
        {
          search: '',
          users: [],
          filters: '',
        },
        {}
      )
      .catch((err) => err);

    const { data } = response || {};

    const newFilterOptions = filtersItems.slice();

    newFilterOptions.push({
      id: 1,
      label: OWNER,
      name: 'assigned_user_id',
      options: data?.users,
      type: 'search',
    });

    setFiltersItems(newFilterOptions);
  }

  const filterID = (id, FList) => {
    return FList
      ? FList.includes(id)
        ? FList.filter((n) => n !== id)
        : [id, ...FList]
      : [id];
  };

  const onHandleFilterContact = (item, avatars = true) => {
    const prevFils = filterSelected.filter
      ? filterSelected.filter.assigned_user_id
      : null;
    setOpenFilter(false);

    if (item) setListDeals(initialDeals);
    setFilterSelected({
      ...filterSelected,
      filter: {
        assigned_user_id: avatars ? filterID(item.id, prevFils) : [item.id],
      },
    });

    setPaginationData({ page: paginationDefault.page });
  };

  const onHandleFilterDeal = (item) => {
    onHandleFilterContact(item, false);
  };

  useEffect(() => {
    if (!title.key) {
      // only update filter in FE in case if key:0 otherwise its breaking three months old and other deals filters
      setDealFilterOptionSelected(title);
    }
  }, [title]);

  const GetUserByID = async (id) => {
    const response = await userService
      .getUserById(id)
      .catch((err) => console.log(err));
    return response;
  };

  useEffect(async () => {
    if (filterSelected.filter) {
      if (
        filterSelected.filter.assigned_user_id &&
        filterSelected.filter.assigned_user_id.length !== 0
      ) {
        const Len = filterSelected.filter.assigned_user_id.length;
        if (Len > 1) {
          setTitle({ key: 0, name: `${Len} Users` });
        } else {
          const Title = await GetUserByID(
            filterSelected.filter.assigned_user_id[0]
          );
          setTitle({
            key: 0,
            name: `User: ${Title.first_name} ${Title.last_name}`,
          });
        }
      } else if (
        filterSelected.filter.status ||
        filterSelected.filter.recent_activity ||
        filterSelected.filter.start_date
      ) {
        // dont liking it :| not breaking faizan implementation
        const filterStatus = filterSelected.filter.recent_activity
          ? 'RecentlyViewed'
          : filterSelected.filter.status;
        const Title = DEALS_FILTER_OPTIONS_LIST.filter(
          (status) => status.key === filterStatus
        )[0];
        setTitle(Title);
      } else {
        setTitle({ id: 4, key: 'opened', name: 'Open Deals' });
      }
    }
  }, [filterSelected]);

  const onGetDeals = async (count) => {
    setShowLoading(true);
    const params = { page: paginationData.page, order, limit: 10 };
    const response = await dealService.getDeals(
      { ...filterSelected, order },
      params
    );

    const { data } = response || {};

    if (data?.pagination) setPagination(data.pagination);
    setAllDeals(data?.deals);
    const total = data?.summary?.reduce((acc, data) => {
      return {
        total: (acc.total || 0) + Number(data.total_amount),
        count_deals: (acc.count_deals || 0) + data.total_count,
      };
    }, 0);
    setInfoDeals(total);

    if (count) setDataInDB(Boolean(data?.pagination?.totalPages));

    setShowLoading(false);
  };

  const setNotification = async (notificationCode, description) => {
    const notificationsStatus = {
      success: setSuccessMessage,
      error: setErrorMessage,
    };

    notificationsStatus[notificationCode](description);
  };

  const getDeals = async (status, page, order) => {
    const foundStage = getStageByName(status?.name);
    const params = { page, order, limit: 10 };
    const result = await dealService.getDeals(
      { tenant_deal_stage_id: status.id, ...filterSelected },
      params
    );

    setListDeals((prev) => {
      const items = prev[status.name]?.items || [];
      return {
        ...prev,
        [status.name]: {
          stageId: status.id,
          loading: false,
          stagePosition: foundStage?.position || status.stagePosition,
          items: [...items, ...result?.data?.deals],
          pagination: result?.data?.pagination,
          header: result?.data?.summary?.find(
            (element) => element.tenant_deal_stage_id === status.id
          ),
        },
      };
    });
  };

  const dataFilter = (search) => {
    setListDeals(initialDeals);
    setFilterSelected(search);
    setPaginationData({ page: paginationDefault.page });
  };

  useEffect(() => {
    if (isMounted.current) {
      const delayTime = setTimeout(() => {
        dataFilter(searchTerm);
      }, [1000]);
      return () => clearTimeout(delayTime);
    } else isMounted.current = true;
  }, [searchTerm]);

  const editPipeline = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPipelineEdit(!pipelineEdit);
  };

  const changeView = () => {
    setPaginationData({ page: paginationDefault.page });
    setListDeals(initialDeals);
    setActive(!active);
  };

  const refreshDeals = (type, page, load = false) => {
    if (load) getDeals(type, page);
    else {
      type.forEach((status) => {
        setListDeals((prev) => ({
          ...prev,
          [status.name]: {
            stageId: status.id,
            stagePosition: status.stagePosition,
            loading: true,
            items: [],
            pagination: page,
            header: [],
          },
        }));
        getDeals(status, paginationDefault.page);
      });
    }
  };

  const onAddDeal = async () => {
    setAddDealBtnLoading(true);
    setOpenDeal(true);
    setAddDealBtnLoading(false);
  };

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  const handleRefreshBoardHeader = () => {
    setShowLoading(true);
    setRefreshBoardHeader((prevState) => prevState + 1);
    setPipelineEdit(!pipelineEdit);
    setListDeals({});
  };

  const handleSavePipeline = async () => {
    const dealStages = stages.map((stage) => ({
      id: stage.id.includes(NEW_STAGE_ID) ? undefined : stage.id,
      name: stage.name || stage?.deal_stage?.name,
      position: stage.position || stage.stagePosition,
      probability: stage.probability || 0,
    }));
    setPipeLineSaveLoader(true);
    await stageService.updateStages({ deal_stages: dealStages });
    setPipeLineSaveLoader(false);
    handleRefreshBoardHeader();
  };

  const refreshBoard = () => {
    setFlagDeal(!flagDeal);
    setListDeals(initialDeals);
  };

  const handleAddDeal = async (stage) => {
    setSelectedStage(stage);
    setAddDealBtnLoading(true);
    setOpenDeal((prev) => !prev);
    setAddDealBtnLoading(false);
  };

  const handleFilterSelect = (e, status) => {
    e.preventDefault();
    setOpenFilter(!openFilter);
    setListDeals(initialDeals);
    setDealFilterOptionSelected(status);
    const { key } = status;
    const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
    if (key === 'MyDeals') {
      setFilterSelected({
        ...filterSelected,
        filter: { assigned_user_id: [me.id] },
      });
    } else if (key === 'OneMonth') {
      const now = moment().format(dateFormat);
      const startOfMonth = moment().startOf('month').format(dateFormat);
      setFilterSelected({
        ...filterSelected,
        filter: { start_date: startOfMonth, end_date: now, status: key },
      });
    } else if (key === 'ThreeMonths') {
      const startOfTime = moment(new Date(1970, 0, 1)).format(dateFormat);
      const threeMonthsOld = moment().subtract(3, 'months').format(dateFormat);
      setFilterSelected({
        ...filterSelected,
        filter: {
          start_date: startOfTime,
          end_date: threeMonthsOld,
          status: key,
        },
      });
    } else if (key === 'RecentlyViewed') {
      const oneHourBefore = moment()
        .utc()
        .subtract(1, 'hours')
        .format(dateFormat);
      const now = moment().utc().format(dateFormat);
      setFilterSelected({
        ...filterSelected,
        filter: {
          recent_activity: true,
          start_date: oneHourBefore,
          end_date: now,
        },
      });
    } else {
      setFilterSelected({
        ...filterSelected,
        filter: { status: status.key },
      });
    }
    setPaginationData({ page: paginationDefault.page });
  };

  const DEALS_FILTER_OPTIONS_LIST = [
    { id: 1, key: 'RecentlyViewed', name: 'Recently Viewed' },
    { id: 2, key: 'MyDeals', name: 'My Deals' },
    { id: 3, key: 'AllDeals', name: 'All Deals' },
    { id: 4, key: 'opened', name: 'Open Deals' },
    { id: 5, key: 'closed', name: 'Closed Deals' },
    { id: 6, key: 'won', name: 'Won Deals' },
    { id: 7, key: 'lost', name: 'Lost Deals' },
    { id: 8, key: 'deleted', name: 'Deleted Deals' },
    { id: 9, key: 'OneMonth', name: 'Deals created in this month' },
    { id: 10, key: 'ThreeMonths', name: 'More than 3 months old deals' },
  ];
  const DealsFilterTabs = () => {
    return (
      <Tabs
        fill
        justify
        id="controlled-tab-example"
        activeKey={dealFilterTab}
        onSelect={(k) => setDealFilterTab(k)}
        className="mb-1 w-100 idf-tabs"
      >
        <Tab
          eventKey="owners"
          title={
            <span>
              <MaterialIcon icon="person" /> <span> Owners </span>
            </span>
          }
        >
          <div className="px-3 py-2">
            <Filters
              onHandleFilterContact={onHandleFilterDeal}
              dispatch={dispatch}
              filtersItems={filtersItems}
              filterTitle={FILTER_PEOPLE}
              callbackService={userService}
              callbackRequest={'getUsers'}
              callbackResponseData={'users'}
              searchPlaceholder={SEARCH_FOR_USER}
              variant
              showSelectOnly
            />
          </div>
        </Tab>
        <Tab
          eventKey="filters"
          title={
            <span>
              <MaterialIcon icon="filter_list" /> <span> Filters </span>
            </span>
          }
        >
          <div className="py-2 idf-dropdown-item-list">
            {DEALS_FILTER_OPTIONS_LIST.map((option) => (
              <Dropdown.Item
                key={option.id}
                href="#"
                onClick={(e) => handleFilterSelect(e, option)}
                className="px-3"
              >
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className={
                      dealFilterOptionSelected.key === option.key
                        ? 'fw-bold'
                        : ''
                    }
                  >
                    {option.name}
                  </span>
                  {dealFilterOptionSelected.key === option.key && (
                    <MaterialIcon icon="check" clazz="fw-bold" />
                  )}
                </div>
              </Dropdown.Item>
            ))}
          </div>
        </Tab>
      </Tabs>
    );
  };

  return (
    <>
      <div className={'pipeline-header'}>
        <div className="w-100 d-flex mb-3">
          {pipelineEdit ? (
            <SaveCancelPipelineRow
              togglePipelineEdit={editPipeline}
              onSavePipeline={handleSavePipeline}
              loading={pipelineSaveLoader}
              refreshBoard={handleRefreshBoardHeader}
            />
          ) : (
            <>
              <div className="ml-auto mr-3">
                <DataFilters
                  filterSelected={filterSelected}
                  setFilterSelected={setSearchTerm}
                  searchPlaceholder={SEARCH}
                  infoDeals={infoDeals}
                  paginationPage={paginationData}
                  setPaginationPage={setPaginationData}
                  showSearch={false}
                  variant
                >
                  <Dropdown show={openFilter} onToggle={setOpenFilter}>
                    <Dropdown.Toggle
                      variant="white"
                      className="btn btn-sm btn-white dropdown-toggle"
                      id="dropdown-basic"
                    >
                      <div className="d-flex">
                        <MaterialIcon icon="filter_list" clazz="mr-1" />
                        <p
                          className="d-inline-block text-truncate mb-0"
                          style={{ maxWidth: 100 }}
                        >
                          {dealFilterOptionSelected.name || 'Filters'}
                        </p>
                      </div>
                    </Dropdown.Toggle>

                    <Dropdown.Menu
                      className="p-0 dropdown-center"
                      style={{ minWidth: 320 }}
                    >
                      <DealsFilterTabs />
                    </Dropdown.Menu>
                  </Dropdown>
                  <Nav
                    active={active}
                    onclick={() => changeView()}
                    togglePipelineEdit={editPipeline}
                  />
                </DataFilters>
              </div>
              <AddDeal
                className="btn-transparent border-0"
                setOpenDeal={setOpenDeal}
                openDeal={openDeal}
                initialDeals={initialDeals}
                onGetDeals={refreshBoard}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
                selectedStage={selectedStage}
              >
                {(dataInDB || active) && (
                  <ButtonIcon
                    icon="add"
                    classnames="btn-sm ml-1 border-0"
                    loading={addDealBtnLoading}
                    label={DEALS_LABEL_BUTTON}
                    onClick={handleAddDeal}
                  />
                )}
              </AddDeal>
            </>
          )}
        </div>

        <div className="tab-content">
          <div
            className={`tab-pane fade col-12 p-0 ${active && 'active show'}`}
          >
            {showLoading ? (
              <BoardLoader count={5} />
            ) : (
              <Board
                onGetDeals={(type, id, stagePosition, page) => {
                  setListDeals((prev) => ({
                    ...prev,
                    [type]: {
                      stageId: id,
                      stagePosition,
                      loading: true,
                      items: [],
                      pagination: page,
                      header: [],
                    },
                  }));
                  getDeals({ name: type, id: id, stagePosition }, page);
                }}
                setNotification={setNotification}
                listDeals={listDeals}
                onClick={refreshDeals}
                editPipeline={pipelineEdit}
                refreshBoard={refreshBoard}
                refreshBoardHeader={handleRefreshBoardHeader}
                onAddDeal={handleAddDeal}
              />
            )}
          </div>
          <div
            className={`tab-pane fade col-12 p-0 ${!active && 'active show'}`}
          >
            <DealList
              allDeals={allDeals}
              pagination={pagination}
              service={dealService}
              showLoading={showLoading}
              onPaginationChange={(page) =>
                setPaginationData({ ...paginationData, page })
              }
              onAddDeal={onAddDeal}
              dataInDB={dataInDB}
              sortingTable={sortTable}
            />
          </div>
        </div>
      </div>

      <AlertWrapper>
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default Deals;
