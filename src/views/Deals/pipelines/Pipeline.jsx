import { useParams, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { findIndex } from 'lodash';
import { Spinner } from 'reactstrap';

import Heading from '../../../components/heading';
import AddContent from '../../../components/peopleProfile/AddContent';
import dealService from '../../../services/deal.service';
import PipelineOverview from './PipelineOverview';
import PipelineOrganizationInfo from './PipelineOrganizationInfo';
import PipelineContactInfo from './PipelineContactInfo';
import { NO_DEAL } from '../../../utils/constants';
import Steps from '../../../components/steps/Steps';
import PipelineHeader from './PipelineHeader';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import Alert from '../../../components/Alert/Alert';
import { getProductsTotalAmount } from '../../../utils/Utils';
import IdfAdditionalOwners from '../../../components/idfComponents/idfAdditionalOwners/IdfAdditionalOwners';
import DealProducts from './DealProducts';
import userService from '../../../services/user.service';

const Pipeline = () => {
  const params = useParams();
  const { id, activityId } = params || {};
  const [deal, setDeal] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refreshRecentFiles, setRefreshRecentFiles] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [productsTotalAmount, setProductsTotalAmount] = useState(0);
  const [refreshOwners, setRefresOwners] = useState(false);
  const [activityIdOpen, setActivityIdOpen] = useState(activityId);
  const [me, setMe] = useState(null);
  const [refreshPipelineStage, setRefreshPipelineStage] = useState(1);

  const isPrincipalOwner =
    me && deal
      ? me?.roleInfo?.admin_access ||
        me?.roleInfo?.owner_access ||
        deal?.assigned_user_id === me?.id
      : false;

  useEffect(() => {
    if (refreshOwners) {
      setRefresOwners(false);
    }
  }, [refreshOwners]);

  useEffect(() => {
    getDeal();
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (refreshRecentFiles) {
      getDeal();
      setRefreshRecentFiles(false);
    }
  }, [refreshRecentFiles]);

  const getCurrentUser = async () => {
    const me = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    setMe(me);
  };

  const getDeal = async (message) => {
    if (message) {
      setSuccessMessage(message);
      setActivityIdOpen('');
    }
    setIsLoading(true);

    const deal = await dealService
      .getDealById(id)
      .catch((err) => console.log(err));

    setDeal(deal);

    setIsLoading(false);

    setRefreshPipelineStage((prevState) => prevState + 1);
  };

  if (!deal) {
    return <div>{NO_DEAL}</div>;
  }

  const classnames = (index, stages, currentDeal) => {
    const stageIndex = findIndex(stages, {
      id: currentDeal.tenant_deal_stage_id || 'cold',
    });

    if (index <= stageIndex) {
      if (deal.status === 'lost') return 'danger';

      return 'complete';
    }

    return 'light';
  };

  useEffect(() => {
    deal?.deal_products?.length &&
      setProductsTotalAmount(getProductsTotalAmount(deal.deal_products));
  }, [deal?.deal_products]);

  if (deal?.deleted) {
    return <Redirect to="/" />;
  }

  return (
    <>
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
      <Heading useBc title={deal.name} showGreeting={false} />
      <PipelineHeader
        classnames={classnames}
        deal={deal}
        getDeal={getDeal}
        refreshOwners={refreshOwners}
        setRefresOwners={setRefresOwners}
        isPrincipalOwner={isPrincipalOwner}
        refreshPipelineStage={refreshPipelineStage}
      />

      <div className="row">
        <div className="col-lg-4">
          <PipelineOverview
            deal={deal}
            getDeal={getDeal}
            isPrincipalOwner={isPrincipalOwner}
          />

          <PipelineOrganizationInfo deal={deal} getDeal={getDeal} />

          <PipelineContactInfo deal={deal} getDeal={getDeal} />

          <DealProducts
            dealProducts={deal?.deal_products}
            dealId={deal?.id}
            getDeal={getDeal}
            setErrorMessage={setErrorMessage}
            setSuccessMessage={setSuccessMessage}
            totalAmount={productsTotalAmount}
            setTotalAmount={setProductsTotalAmount}
          />

          <IdfAdditionalOwners
            service={dealService}
            mainOwner={deal?.assigned_user}
            refreshOwners={refreshOwners}
            setRefresOwners={setRefresOwners}
            isPrincipalOwner={isPrincipalOwner}
            withFollowers={deal.id}
          />
        </div>

        <div className="col-lg-8">
          <div>
            <AddContent
              dealId={deal.id}
              getDeal={getDeal}
              contactInfo={deal?.contact}
              organizationId={deal?.organization?.id}
              contactIs={'organization'}
              getProfileInfo={getDeal}
              refreshRecentFiles={refreshRecentFiles}
              setRefreshRecentFiles={setRefreshRecentFiles}
            />
          </div>

          {!isLoading ? (
            <Steps
              dealId={deal?.id}
              isDeal
              getProfileInfo={getDeal}
              setRefreshRecentFiles={setRefreshRecentFiles}
              openActivityId={activityIdOpen}
              me={me}
            />
          ) : (
            <div className="mt-4 center-item">
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pipeline;
