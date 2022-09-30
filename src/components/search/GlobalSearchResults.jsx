import { forwardRef, useState, useContext } from 'react';
import { Col, Container, Dropdown, ListGroup, Row, Tab } from 'react-bootstrap';
import { capitalize } from 'lodash/string';

import { ResultsItem } from './ResultsItem';
import constants from './GlobalSearch.constants.json';
import { TenantContext } from '../../contexts/TenantContext';
import { PermissionsWrapper, isMatchInCommaSeperated } from '../../utils/Utils';
import SearchAddQuickAction from './SearchAddQuickAction';

export const GlobalSearchResults = ({
  searchValue,
  searchResults,
  setToast,
}) => {
  return (
    <Dropdown.Menu
      as={CustomSearchResults}
      searchValue={searchValue}
      searchResults={searchResults}
      setToast={setToast}
    />
  );
};

const ResultsList = ({ type, searchResults, setToast, searchValue }) => {
  const [isResultShow, setisResultShow] = useState(false);
  // lesson/course/category is merged into training for now
  const trainingSubCategories = ['lesson', 'course', 'category'];
  // var isResultExist = false;
  return (
    <div className="h-100">
      <h5 className="font-weight-500 pl-3">
        {isResultShow
          ? `${capitalize(type) || ''} search results for '${
              searchValue || ''
            }'`
          : ''}
      </h5>
      <ListGroup className="search-options h-100">
        {searchResults?.map((data, index) => {
          if (
            !type ||
            type === data.kind ||
            (type === 'training' && trainingSubCategories.includes(data.kind))
          ) {
            if (!isResultShow) {
              setisResultShow(true);
            }
            const key = `search_result_${index}`;

            return (
              <ResultsItem
                key={key}
                type={data.kind}
                activityType={data.type}
                contactId={data.contact_id}
                contactName={data.contact_name?.trim()}
                dealId={data.deal_id}
                dealName={data.deal_name}
                organizationId={data.organization_id}
                organizationName={data.organization_name}
                lessonId={data.lesson_id}
                lessonName={data.lesson_name}
                categoryId={data.category_id}
                categoryName={data.category_name}
                courseId={data.course_id}
                courseName={data.course_name}
                activityId={data.activity_id}
                activityName={data.activity_name}
                fileId={data.file_id}
                fileName={data.file_name}
                setToast={setToast}
              />
            );
          } else return null;
        })}
      </ListGroup>
      {
        // if no result found show message and add action
        !isResultShow ? (
          <div className="h-100 text-center px-8 pt-8">
            <h4>
              No result in {type} for <q>{searchValue}</q>
            </h4>
            <SearchAddQuickAction
              type={type}
              searchValue={searchValue}
            ></SearchAddQuickAction>
          </div>
        ) : (
          <></>
        )
      }
    </div>
  );
};

const CustomSearchResults = forwardRef(
  (
    {
      className,
      style,
      'aria-labelledby': labeledBy,
      searchValue,
      searchResults,
      setToast,
    },
    ref
  ) => {
    const { tenant } = useContext(TenantContext);

    const optionsList = constants.optionsList.filter((el) => {
      if (!tenant.modules || tenant.modules === '*') {
        return true;
      } else {
        return isMatchInCommaSeperated(tenant.modules, el.label);
      }
    });

    const OptionsList = () => (
      <Col sm={3} className="px-1 pt-4 pb-2">
        <ListGroup className="search-options">
          {optionsList.map((option) => {
            const hasDealsPermissions = PermissionsWrapper({
              // show tab according to user permission
              collection: option.name,
              action: 'view',
            });
            return (
              <>
                {hasDealsPermissions ? (
                  <ListGroup.Item
                    key={option.name}
                    action
                    eventKey={option.name}
                    className="rounded font-weight-500 py-2 px-3 border-0 global-search-item"
                  >
                    <span className="material-icons-outlined mr-2">
                      {option.icon}
                    </span>
                    {option.label}
                  </ListGroup.Item>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </ListGroup>
      </Col>
    );

    const Results = () => (
      <Col sm={9} className="px-1 pt-4 pb-2 border-left">
        <Tab.Content class="h-100" style={{ height: '100%' }}>
          {optionsList.map((tab) => {
            const hasDealsPermissions = PermissionsWrapper({
              // show section according to user permission
              collection: tab.name,
              action: 'view',
            });
            return (
              <>
                {hasDealsPermissions ? (
                  <Tab.Pane eventKey={tab.name} key={tab.name}>
                    <ResultsList
                      type={tab.type}
                      searchResults={searchResults}
                      setToast={setToast}
                      searchValue={searchValue}
                    />
                  </Tab.Pane>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </Tab.Content>
      </Col>
    );

    const ResultsPanel = ({ children }) => (
      <div
        ref={ref}
        style={style}
        className={`${className} search-dropdown-menu p-0`}
        aria-labelledby={labeledBy}
      >
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="all">
          <Container>
            <Row>{children}</Row>
          </Container>
        </Tab.Container>
      </div>
    );

    return (
      <ResultsPanel>
        <OptionsList />
        <Results />
      </ResultsPanel>
    );
  }
);

CustomSearchResults.displayName = 'CustomSearchResults';
