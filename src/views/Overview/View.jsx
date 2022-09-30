import React, { useState, useEffect, useContext } from 'react';

import Heading from '../../components/heading';
import { Input } from 'reactstrap';
import { DragDropContext } from 'react-beautiful-dnd';

import ButtonFilterDropdown from '../../components/commons/ButtonFilterDropdown';
import ButtonIcon from '../../components/commons/ButtonIcon';
import {
  DashboardShareOptions,
  isMatchInCommaSeperated,
  percentageChange,
} from '../../utils/Utils';
import NoDataFound from '../../components/commons/NoDataFound';
import MaterialIcon from '../../components/commons/MaterialIcon';
import {
  COMPONENTS_BY_DASH_ID,
  DashboardComponentTypes,
  ProgressData,
  StatsData,
} from './dashboard/dashboard.constants';
import StatWidget from './dashboard/components/StatWidget';
import ListWidget from './dashboard/components/ListWidget';
import Masonry from 'react-masonry-css';
import { TenantContext } from '../../contexts/TenantContext';
import DashboardService from '../../services/dashboard.service';
import { AnalyticsQuery } from '../../components/analytics';
import ProgressWidget from './dashboard/components/ProgressWidget';
import BarChartWidget from './dashboard/components/BarChartWidget';
import { NO_DATA_AVAILABLE } from '../../utils/constants';

const Overview = () => {
  const [dashboardList, setDashboardList] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState({});
  const [dashboardComponents, setDashboardComponents] = useState([]);
  const [staticComponents, setStaticComponents] = useState([]);
  const [toggleNameEdit, setToggleNameEdit] = useState(false);
  const { tenant } = useContext(TenantContext);
  const [selectedShareOption, setSelectedShareOption] = useState(
    DashboardShareOptions[0]
  );

  const getDashboardComponents = async () => {
    const { data } = await DashboardService.getDashboardsComponents(
      selectedDashboard.id
    );
    setDashboardComponents(data?.data);
  };

  const getDashboards = async () => {
    const { data } = await DashboardService.getDashboards();
    const dashboards = data.data?.map((a) => ({
      ...a,
      key: a.id,
      icon: 'dashboard',
    }));

    const dashboardsFiltered = dashboards.filter((dashboard) => {
      if (tenant.modules === '*') {
        return true;
      } else {
        const settingsInput = 'Dashboard-' + dashboard.name;
        return isMatchInCommaSeperated(tenant.modules, settingsInput);
      }
    });

    setDashboardList(dashboardsFiltered);

    if (dashboardsFiltered.length > 0) {
      setSelectedDashboard(dashboardsFiltered[0]);
    }
    getDashboardComponents();
  };

  const updateDashboardsList = (newDashboard) => {
    const currentDashboardList = [...dashboardList];
    currentDashboardList.forEach((ds) => {
      if (ds.key === newDashboard.key) {
        ds.name = newDashboard.name;
      }
    });
    setDashboardList(currentDashboardList);
  };

  useEffect(() => {
    if (tenant.modules) {
      getDashboards();
    }
  }, [tenant.modules]);

  useEffect(() => {
    if (selectedDashboard?.id && selectedDashboard.name === 'Training') {
      getDashboardComponents();
    } else {
      const components = COMPONENTS_BY_DASH_ID[selectedDashboard.name];
      setDashboardComponents([]);
      setStaticComponents(components);
    }
  }, [selectedDashboard]);

  const handleSelectedDashboard = (e, selected) => {
    setSelectedDashboard(selected);
  };

  const handleOptionShare = (e, option) => {
    setSelectedShareOption(option);
  };

  const toggleDashboardNameEdit = () => {
    setToggleNameEdit(!toggleNameEdit);
  };

  const saveDashboardName = () => {
    toggleDashboardNameEdit();
  };

  const DashboardNameEdit = ({ selectedDashboard, updateDashboardsList }) => {
    const [name, setName] = useState(selectedDashboard.name);
    const handleOnChangeName = (e) => {
      setName(e.target.value);
    };

    const handleSaveName = () => {
      updateDashboardsList({ ...selectedDashboard, name });
      saveDashboardName();
    };

    return (
      <div className="d-flex align-items-center w-100 justify-content-between">
        <div className="d-flex align-items-center w-75">
          <Input
            type="text"
            onChange={handleOnChangeName}
            value={name || ''}
            className="w-30 mr-2"
          />
          <ButtonFilterDropdown
            buttonText="Share"
            btnToggleStyle={'btn-md'}
            options={DashboardShareOptions}
            handleFilterSelect={handleOptionShare}
            filterOptionSelected={selectedShareOption}
          />
        </div>
        <div className="d-flex align-items-center">
          <ButtonIcon
            color="white"
            onclick={toggleDashboardNameEdit}
            label="Cancel"
            classnames="px-3 mx-2"
          />
          <ButtonIcon
            color="primary"
            onclick={handleSaveName}
            label="Save"
            classnames="px-3"
          />
        </div>
      </div>
    );
  };

  const SelectDashboards = () => {
    return (
      <div className="d-flex align-items-center">
        <ButtonFilterDropdown
          buttonText="Dashboards"
          options={dashboardList}
          filterOptionSelected={selectedDashboard}
          handleFilterSelect={handleSelectedDashboard}
        />
      </div>
    );
  };

  const noData = () => {
    const Title = () => {
      return <div className="text-gray-search">{NO_DATA_AVAILABLE}</div>;
    };
    return (
      <NoDataFound
        icon="manage_search"
        containerStyle="text-gray-search my-6 py-6"
        title={<Title />}
      />
    );
  };

  const DynamicComponent = ({ item }) => {
    const { component } = item;
    const { displayType } = component.analytic;
    return (
      <div className={`card setting-item overflow-hidden`} style={item.style}>
        <div className="card-header justify-content-between">
          <div className="d-flex align-items-center">
            <MaterialIcon icon="drag_indicator" clazz="mr-2" />
            <h5 className="card-title font-size-sm text-hover-primary mb-0">
              {component.name}
            </h5>
          </div>
        </div>
        <div
          className={`card-body ${displayType === 'kpi_standard' ? '' : 'p-0'}`}
        >
          <AnalyticsQuery
            query={component.analytic}
            render={(results) => {
              if (displayType === 'kpi_rankings') {
                const [{ data }] = results;
                if (data.length === 0) {
                  return noData();
                }
                const list = data
                  .map((item) => {
                    const itemKeys = Object.keys(item);
                    if (itemKeys.includes('Lesson.title')) {
                      return {
                        name: item['Lesson.title'],
                        count: item['LessonProgress.countOfCompleted'],
                      };
                    } else if (itemKeys.includes('Course.name')) {
                      return {
                        name: item['Course.name'],
                        count: item['CourseProgress.countOfCompleted'],
                      };
                    } else if (itemKeys.includes('User.firstName')) {
                      return {
                        name: `${item['User.firstName']} ${item['User.lastName']}`,
                        count: item['LessonProgress.countOfCompleted'],
                      };
                    }
                    return null;
                  })
                  .filter((item) => !!item);

                if (
                  list.length === 0 ||
                  list.every((item) => parseInt(item.count) === 0)
                ) {
                  return noData();
                }
                return <ListWidget data={list} listType="" />;
              } else if (displayType === 'kpi_standard') {
                if (results.length > 0) {
                  const dataObject = results[0].data[0];
                  const dataObjectLastMonth = results[1]?.data[0];
                  const objectKeys = Object.keys(dataObject);
                  if (dataObject) {
                    const count = objectKeys.includes('LessonProgress.count')
                      ? dataObject['LessonProgress.count']
                      : dataObject['LessonProgress.countOfCompleted'];
                    const objectKeysLastMonth =
                      Object.keys(dataObjectLastMonth);
                    const lastMonth = objectKeysLastMonth.includes(
                      'LessonProgress.count'
                    )
                      ? dataObjectLastMonth['LessonProgress.count']
                      : dataObjectLastMonth['LessonProgress.countOfCompleted'];
                    const percentage = percentageChange(
                      lastMonth,
                      count
                    ).toFixed(0);
                    return (
                      <StatWidget data={{ count, lastMonth, percentage }} />
                    );
                  }
                } else {
                  return noData();
                }
              }
            }}
          />
        </div>
      </div>
    );
  };

  const StaticComponent = ({ item }) => {
    const component = item;
    return (
      <div className={`card setting-item overflow-hidden`} style={item.style}>
        <div className="card-header justify-content-between">
          <div className="d-flex align-items-center">
            <MaterialIcon icon="drag_indicator" clazz="mr-2" />
            <h5 className="card-title font-size-sm text-hover-primary mb-0">
              {component.name}
            </h5>
          </div>
        </div>
        <div
          className={`card-body ${
            component.type === DashboardComponentTypes.Stat ||
            component.type === DashboardComponentTypes.VChart
              ? ''
              : 'p-0'
          }`}
        >
          {component.type === DashboardComponentTypes.Stat && (
            <StatWidget data={component.data} />
          )}
          {component.type === DashboardComponentTypes.Progress && (
            <ProgressWidget data={component.data} />
          )}
          {component.type === DashboardComponentTypes.VChart && (
            <BarChartWidget data={component.data} type={item.styleType} />
          )}
          {component.type === DashboardComponentTypes.List && (
            <ListWidget
              data={component.data}
              listType={
                selectedDashboard.name === 'Training' ||
                selectedDashboard.name === 'Overview'
                  ? ''
                  : selectedDashboard.name
              }
            />
          )}
        </div>
      </div>
    );
  };

  const DEAL_TWO_COLUMNS = [
    {
      id: 78,
      name: 'Revenue Lost - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[6],
    },
    {
      id: 68,
      name: 'Open Deals by Stage - This Month',
      type: DashboardComponentTypes.Progress,
      data: ProgressData[1],
      className: 'expanded w-100 mw-100',
    },
    {
      id: 58,
      name: 'Deals Lost - This Month',
      type: DashboardComponentTypes.Stat,
      data: StatsData[5],
    },
  ];

  return (
    <>
      <Heading useBc={false}>
        {toggleNameEdit ? (
          <DashboardNameEdit
            selectedDashboard={selectedDashboard}
            updateDashboardsList={updateDashboardsList}
          />
        ) : (
          <SelectDashboards />
        )}
      </Heading>
      {dashboardComponents?.length || staticComponents?.length ? (
        <DragDropContext>
          {selectedDashboard.name === 'Training' ? (
            <Masonry
              breakpointCols={3}
              className="my-masonry-grid mt-2 px-1 pt-2 pb-0"
              columnClassName="my-masonry-grid_column"
            >
              {dashboardComponents?.map((item) => (
                <DynamicComponent key={item.id} item={item} />
              ))}
            </Masonry>
          ) : (
            <>
              <Masonry
                breakpointCols={3}
                className="my-masonry-grid mt-2 px-1 pt-2 pb-0"
                columnClassName="my-masonry-grid_column"
              >
                {staticComponents?.map((item) => (
                  <StaticComponent key={item.id} item={item} />
                ))}
              </Masonry>
              {selectedDashboard.name === 'Overview' && (
                <Masonry
                  breakpointCols={1}
                  className="my-masonry-grid p-1"
                  columnClassName="my-masonry-grid_column"
                >
                  <StaticComponent
                    item={{
                      id: 6,
                      name: 'Revenue Won by Month',
                      type: DashboardComponentTypes.Progress,
                      data: ProgressData[1],
                      className: 'expanded',
                    }}
                  />
                </Masonry>
              )}

              {selectedDashboard.name === 'Deal' && (
                <>
                  <Masonry
                    breakpointCols={{
                      default: 2,
                    }}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column my-masonry-grid_column_2"
                  >
                    {DEAL_TWO_COLUMNS.map((item) => (
                      <StaticComponent key={item.id} item={item} />
                    ))}
                  </Masonry>
                  <Masonry
                    breakpointCols={1}
                    className="my-masonry-grid p-1"
                    columnClassName="my-masonry-grid_column"
                  >
                    <StaticComponent
                      item={{
                        id: 6,
                        name: 'Revenue Won by Month',
                        type: DashboardComponentTypes.VChart,
                        data: ProgressData[1],
                        styleType: 'expanded',
                        style: { height: 335 },
                      }}
                    />
                  </Masonry>
                </>
              )}
            </>
          )}
        </DragDropContext>
      ) : (
        <NoDataFound
          title="No components available"
          description="To get started, add component from top right."
          icon="dashboard"
          containerStyle="text-gray-900 my-6 py-6"
        />
      )}
    </>
  );
};

export default Overview;
