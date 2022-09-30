import { Image } from 'react-bootstrap';
import { useState } from 'react';
import { Spinner } from 'reactstrap';
import SimpleModalCreation from '../../modal/SimpleModalCreation';
import helpOutline from '../../../assets/svg/help_outline.svg';
import { CardButton } from '../../layouts/CardLayout';
import orgService from '../../../services/organization.service';
import { useParams } from 'react-router-dom';
import RocketReachOrganizationCard from './RocketReachOrganizationCard';

const ImportOrganization = ({
  children,
  openImportModal,
  setOpenImportModal,
  prospect,
}) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);

  const importOrg = async () => {
    setLoading(true);
    const updateOrganizationData = {
      employees: prospect.employees,
      address_street: prospect.address,
      annual_revenue: prospect.revenue,
      total_revenue: prospect.revenue,
      industry: prospect.industry,
      address_city: prospect.city,
      address_state: prospect.state,
      address_country: prospect.country,
      address_postalcode: prospect.postal_code,
      sic_code: '' + prospect.sic,
      naics_code: '' + (prospect.naics || prospect.sic),
      ticker_symbol: prospect.ticker,
      avatar: prospect.logo,
      phone_office: prospect.phone,
      website: prospect.domain,
    };

    // import, but we are really updating existing info
    await orgService.updateOrganization(
      params.organizationId,
      updateOrganizationData
    );

    setLoading(false);
    setOpenImportModal(false);
    window.location.reload(false);
    // refresh contact
  };
  return (
    <div>
      {openImportModal && (
        <SimpleModalCreation
          open={openImportModal}
          bodyClassName="text-center"
          customModal="w-25"
          noFooter
          bankTeam
        >
          {!loading ? (
            <div>
              <Image src={helpOutline} className="mb-4" />

              <p className="font-inter">
                Are you sure you want to import the following organization?
                Importing will overwrite existing organization details.
              </p>

              <div className="card">
                <div className="card-body mb-2">
                  <RocketReachOrganizationCard
                    prospect={prospect}
                    showDescription={false}
                  />
                </div>
              </div>
            </div>
          ) : (
            <Spinner />
          )}

          <div className="d-flex my-3">
            <CardButton
              type="button"
              title="No, Cancel"
              className="mt-2 btn btn-sm btn-outline-danger mr-2 w-50"
              onClick={() => setOpenImportModal(false)}
            />

            <CardButton
              type="button"
              title="Import"
              variant="primary"
              className="mt-2 btn-sm w-50"
              disabled={loading}
              onClick={() => importOrg()}
            />
          </div>
        </SimpleModalCreation>
      )}
      {children}
    </div>
  );
};

export default ImportOrganization;
