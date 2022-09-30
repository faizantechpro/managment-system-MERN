import { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { startCase } from 'lodash';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { tagsColorHex } from '../Deals/contacts/Contacts.constants';
import {
  COMPLETED,
  EMPTY_DATA,
  MAX_CATEGORY_SELECTED,
  MIN_CATEGORY_SELECTED,
} from '../../utils/constants';
import IdfSelectCategoriesWithCheckbox from '../../components/idfComponents/idfDropdown/IdfSelectCategoriesWithCheckbox';
import categoryService from '../../services/category.service';
import AlertWrapper from '../../components/Alert/AlertWrapper';
import Alert from '../../components/Alert/Alert';
import sorry from '../../assets/svg/illustrations/sorry.svg';
import { InsightsQuery } from './components/InsightsQuery';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  barPercentage: 0.3,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
};

const PopularLessons = ({ insight, insightName }) => {
  const [categoryList, setCategoryList] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  const [queryFilters, setQueryFilters] = useState([]);
  const [query, setQuery] = useState(insight);

  useEffect(async () => {
    const response = await categoryService
      .GetCategories(null, { limit: 10 })
      .catch((err) => console.log(err));

    const { data } = response || {};

    setQueryFilters(data?.map((item) => item));
    setCategoryList(data?.map((item) => item));
  }, []);

  useEffect(() => {
    if (query && Object.keys(query).length > 0 && queryFilters.length > 0) {
      const categoryIds = queryFilters.map((category) =>
        category.id.toString()
      );

      const categoryFilter = query.filters.find(
        (filter) =>
          filter.operator === 'equals' && filter.member === 'Category.id'
      );
      if (!categoryFilter) {
        return;
      }

      const isSameFilter =
        categoryIds.length === categoryFilter.values.length &&
        categoryIds.every((id) => categoryFilter.values.includes(id));
      if (isSameFilter) {
        return;
      }

      query.filters.forEach((filter) => {
        if (filter.operator === 'equals' && filter.member === 'Category.id') {
          filter.values = categoryIds;
        }
      });

      setQuery(query);
    }
  }, [queryFilters]);

  const onSetOwner = async (e) => {
    const newCategoryList = categoryList.slice();

    const exist = newCategoryList.find((item) => item?.id === e.target.value);

    if (!exist && categoryList.length > 9) {
      return setWarningMessage(MAX_CATEGORY_SELECTED);
    }
    if (exist && categoryList.length < 2) {
      return setWarningMessage(MIN_CATEGORY_SELECTED);
    } else if (exist && categoryList.length > 1) {
      return setCategoryList(
        newCategoryList.filter((owner) => owner.id !== exist?.id)
      );
    } else {
      const categoryInfo = await categoryService.GetCategoryById(
        e.target.value
      );

      if (categoryInfo) {
        newCategoryList.push(categoryInfo);
      }
    }
    setCategoryList(newCategoryList);
  };

  const applyFilter = () => {
    setQueryFilters(categoryList);
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Row className="pl-3 w-100 d-flex align-items-center">
            <Col>
              <h4>{insightName}</h4>
            </Col>
            <Col className="col-auto d-flex p-0 justify-content-between">
              <IdfSelectCategoriesWithCheckbox
                id="category_id"
                checkedList={categoryList}
                setCheckedList={setCategoryList}
                onChange={onSetOwner}
                applyFilter={applyFilter}
              />
            </Col>
          </Row>
        </Card.Header>

        <InsightsQuery
          query={query}
          setQuery={setQuery}
          render={(results) => {
            const { data } = results[0];

            const labelTitles = queryFilters.map((label) => label.title);

            const labelCountTuple = labelTitles.map((title) => {
              const lesson = data.find(
                (metric) => metric['Category.title'] === title
              );
              if (!lesson) {
                return [title, '0'];
              }
              return [title, lesson['LessonProgress.count']];
            });

            const chartData = {
              labels: labelCountTuple.map(([title]) => title),
              datasets: [
                {
                  label: 'Completed',
                  data: labelCountTuple.map(([, count]) => count),
                  backgroundColor: '#ff5a2c',
                },
              ],
            };

            const sum = labelCountTuple.reduce((acc, [, count]) => {
              return acc + Number(count);
            }, 0);

            if (sum === 0) {
              return (
                <div className="d-flex justify-content-center align-items-center h-spinner">
                  <div className="w-25 text-center">
                    <img src={sorry} width="100px" />
                    <p>{EMPTY_DATA}</p>
                  </div>
                </div>
              );
            }

            return (
              <div style={{ maxWidth: '1220px' }}>
                <div style={{ height: '400px' }}>
                  <Bar options={options} data={chartData} />
                </div>

                <div className="row justify-content-center mt-4 pt-4 border-top">
                  <div className="col-auto">
                    <span
                      className={`legend-indicator`}
                      style={{ background: tagsColorHex.lost }}
                    ></span>
                    {startCase(COMPLETED)}
                  </div>
                </div>
              </div>
            );
          }}
        />
      </Card>

      <AlertWrapper>
        <Alert
          color="danger"
          message={warningMessage}
          setMessage={setWarningMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default PopularLessons;
