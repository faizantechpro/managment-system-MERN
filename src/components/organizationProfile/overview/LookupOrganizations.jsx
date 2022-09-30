import { useEffect, useState } from 'react';
import _ from 'lodash';

import corporateFare from '../../../assets/svg/corporate_fare.svg';
import { CardButton } from '../../layouts/CardLayout';
import ImportOrganization from './ImportOrganization';
import prospectService from '../../../services/prospect.service';
import RocketReachOrganizationCard from './RocketReachOrganizationCard';
import LookupOrganizationLoader from '../../loaders/LookupOrganization';
import ButtonIcon from '../../commons/ButtonIcon';

const LookupOrganizations = ({ profileInfo }) => {
  const [prospects, setProspects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [error, setError] = useState('No matching profiles, Try searching.');
  const [filter, setFilter] = useState({
    name: profileInfo.organization
      ? profileInfo.organization.name
      : profileInfo.name,
  });

  useEffect(() => {
    prospectsData();
  }, []);

  const prospectsData = async (page = 1) => {
    setLoading(true);

    // makes sure we are not in an org profile
    // is there a company associated with contact? if not dont do anything
    if (!_.has(profileInfo, 'naics_code') && !profileInfo.organization_id) {
      setLoading(false);
      setError('This contact does not have any organization information.');
      return;
    }

    if (profileInfo.organization && profileInfo.organization_id !== '') {
      // lookup organization by Id
      setFilter({ name: profileInfo.organization.name });
    }

    let response = null;

    try {
      response = await prospectService.getCompany(filter, {
        page,
      });
    } catch (e) {
      setLoading(false);
    }

    if (response?.status === 200 && !response.data.error) {
      setProspects([response?.data]);
    }

    setLoading(false);
  };

  return (
    <div>
      {!loading ? (
        prospects?.map((prospect) => (
          <div key={prospect.id} className="card my-4">
            <div className="card-body">
              <RocketReachOrganizationCard
                prospect={prospect}
                readMore={readMore}
                setReadMore={setReadMore}
              />

              <ImportOrganization
                openImportModal={openImportModal}
                setOpenImportModal={setOpenImportModal}
                prospect={prospect}
              >
                <ButtonIcon
                  icon="add"
                  onclick={() => setOpenImportModal(true)}
                  color="success"
                  label="Import Organization"
                  classnames="btn-sm mt-2 btn-block"
                />
              </ImportOrganization>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-4">
          <LookupOrganizationLoader />
        </div>
      )}

      {prospects?.length > 3 && (
        <CardButton
          type="submit"
          title="Load More"
          variant="primary"
          className="mr-2 w-100"
        />
      )}

      {!prospects?.length && !loading && (
        <div>
          <img src={corporateFare} />
          <p className="prospect-typography-h6 text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default LookupOrganizations;
