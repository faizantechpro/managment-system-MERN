import React, { useState, useEffect } from 'react';
import { FormControl, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { CardButton } from '../../layouts/CardLayout';
import usersOutlined from '../../../assets/svg/users-outlined.svg';
import prospectService from '../../../services/prospect.service';
import ProspectCard from './ProspectCard';
import _ from 'lodash';
import LookupPeopleLoader from '../../loaders/LookupPeople';
import routes from '../../../utils/routes.json';

const LookupPeople = ({ profileInfo = {} }) => {
  const history = useHistory();
  const limit = 4;
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchProspect, setSearchProspect] = useState('');
  const [filter, setFilter] = useState({
    name: `${
      profileInfo.name || profileInfo.first_name + ' ' + profileInfo.last_name
    }`,
  });

  useEffect(() => {
    if (_.has(profileInfo, 'naics_code') && searchProspect === '') {
      // if this is a company profile we are opening the lookup panel,
      // then lets look employees within the company, ignore for search
      getEmployees({ current_employer: [filter.name] });
    } else {
      // get contacts with similar name
      if (profileInfo.organization) {
        getContact({
          name: [filter.name],
          current_employer: [profileInfo.organization.name],
        });
      } else {
        getContact({ ...filter });
      }
    }
  }, [filter]);

  const getContact = async (opts) => {
    setLoading(true);
    const resp = await prospectService.query(opts, { type: 'query', limit });
    setProspects(resp.data?.data);
    setLoading(false);
  };

  const getEmployees = async (opts) => {
    setLoading(true);
    const resp = await prospectService.query(opts, { type: 'query', limit });
    setProspects(resp.data?.data);
    setLoading(false);
  };

  const onKeyEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();

      setFilter({
        ...filter,
        current_employer: [profileInfo.name], // organization name
        name: [searchProspect],
      });
    }
  };

  const redirectToProspectsSearch = () => {
    history.push(`${routes.resources}?current_employer=${profileInfo.name}`);
  };

  return (
    <div>
      <Form className="global-search d-flex align-items-center w-100 my-3">
        <span className="material-icons-outlined ml-3">search</span>
        <FormControl
          id="global-search-input"
          aria-label="Search"
          className="border-0 search-input"
          placeholder="Search"
          value={searchProspect || ''}
          onChange={(e) => setSearchProspect(e.target.value)}
          onKeyDown={onKeyEnter}
        />
      </Form>
      {!loading ? (
        prospects?.map((prospect) => (
          <ProspectCard
            key={prospect.id}
            organization={profileInfo}
            prospect={prospect}
          />
        ))
      ) : (
        <LookupPeopleLoader count={limit} container lineCount={4} />
      )}
      {prospects?.length > 3 && !loading && (
        <CardButton
          title="Load More"
          variant="primary"
          className="mr-2 w-100"
          onClick={redirectToProspectsSearch}
          // isLoading={loading}
        />
      )}

      {!prospects?.length && !loading && (
        <div>
          <img src={usersOutlined} />
          <p className="prospect-typography-h6 text-center">
            No matching profiles, Try searching.
          </p>
        </div>
      )}
    </div>
  );
};

export default LookupPeople;
