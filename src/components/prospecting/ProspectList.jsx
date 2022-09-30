import React, { useEffect, useState } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import prospectService from '../../services/prospect.service';

import Search from '../manageUsers/Search';
import ProspectTable from './ProspectTable';
import stringConstants from '../../utils/stringConstants.json';
import { numberWithCommas } from '../../utils/Utils';
import CompanyTable from './CompanyTable';

const constants = stringConstants.deals.prospecting;

const ProspectList = ({ onHandleImport, domain, filter }) => {
  const [data, setData] = useState({ prospects: [], pagination: {} });
  const [spinner, setSpinner] = useState(false);
  const [findValue, setFindValue] = useState('');

  const onHandleChangePage = (page) => {
    getProspects({ page });
  };

  const onHandleClickSearch = (e) => {
    if (e.key === 'Enter') {
      getProspects({ search: findValue });
    }
  };

  const getProspects = async ({ page = 1, limit = 10, search = '' }) => {
    setSpinner(true);

    await prospectService
      .getProspects({ domain, filter }, { page, limit, name: search })
      .then(({ data }) => {
        const {
          data: { meta, results },
        } = data;

        const { page, total } = meta;
        let pagination = {};

        if (page) {
          pagination = {
            page: page,
            limit: 10,
            totalPages: total / 10,
            count: total,
          };
        }

        setData({ prospects: results, pagination });
      })
      .catch((e) => console.log(e))
      .finally(() => {
        setSpinner(false);
      });
  };

  useEffect(() => {
    getProspects({});
  }, [filter]);

  return (
    <Card>
      {!domain && (
        <Card.Header className="row no-gutters w-100">
          <div className="col-xs-6 col-md-8">
            {filter.type.trim() === '' && (
              <Search
                onHandleKeyPress={(e) => onHandleClickSearch(e)}
                classnames="col-xs-8 col-md-6"
                searchPlaceholder={constants.searchLabel}
                onHandleChange={(e) => setFindValue(e.target.value)}
                tooltip="Press enter to find"
              />
            )}
          </div>
          <div className="d-flex justify-content-end">
            <span className="text-muted">
              {!spinner ? numberWithCommas(data?.pagination?.count) || 0 : 0}{' '}
              Prospects
            </span>
          </div>
        </Card.Header>
      )}

      {domain && (
        <Card.Header>
          <h3 className="m-0 p-0">Prospects at {domain}</h3>

          <div className="d-flex justify-content-end align-items-baseline w-40">
            <span className="text-muted">
              {numberWithCommas(data?.pagination?.count) || 0} Prospects
            </span>
            <Search
              onHandleKeyPress={(e) => onHandleClickSearch(e)}
              classnames="col-xs-8 col-md-6"
              searchPlaceholder={constants.searchLabel}
              onHandleChange={(e) => setFindValue(e.target.value)}
              tooltip="Press enter to find"
            />
          </div>
        </Card.Header>
      )}

      <Card.Body className={`p-0`}>
        {spinner && (
          <div className="text-center">
            <Spinner
              animation="border"
              className="ui-spinner-input my-3 text-primary"
              variant="primary"
            />
          </div>
        )}
        {!spinner && (
          <>
            {filter?.globalSearch && filter.type === 'company' && (
              <CompanyTable
                data={data?.prospects}
                paginationInfo={data?.pagination}
                onHandleEdit={onHandleImport}
                onPageChange={onHandleChangePage}
              />
            )}
            {(!filter?.globalSearch || filter?.type !== 'company') && (
              <ProspectTable
                data={data?.prospects}
                paginationInfo={data?.pagination}
                onHandleEdit={onHandleImport}
                onPageChange={onHandleChangePage}
              />
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProspectList;
