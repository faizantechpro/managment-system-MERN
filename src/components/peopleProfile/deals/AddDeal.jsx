import React, { useState, useReducer, useEffect } from 'react';
import Mousetrap from 'mousetrap';
import { useHistory } from 'react-router-dom';
import routes from '../../../utils/routes.json';

import dealService from '../../../services/deal.service';
import {
  ADD_DEAL,
  DEAL_CONTACT,
  EMPTY_CURRENCY,
  EMPTY_DEAL_NAME,
  EMPTY_ORG_NAME,
} from '../../../utils/constants';
import { initialDealsForm } from '../../../views/Deals/contacts/Contacts.constants';
import {
  onHandleCloseModal,
  reducer,
} from '../../../views/Deals/contacts/utils';
import AlertWrapper from '../../Alert/AlertWrapper';
import DealForm from '../../deals/DealForm';
import SimpleModalCreation from '../../modal/SimpleModalCreation';
import Alert from '../../../components/Alert/Alert';

const AddDeal = ({
  organizationId,
  onGetDeals,
  children,
  setOpenDeal,
  openDeal,
  profileInfo,
  errorMessage,
  setErrorMessage = () => {},
  successMessage,
  setSuccessMessage = () => {},
  fromNavbar,
  setOpenList,
  searchValue,
  initialDeals,
  selectedStage,
}) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preOwners, setPreOwners] = useState([]);
  const [modalSize, setModalSize] = useState('sm');

  const [dealFormData, dispatchFormData] = useReducer(
    reducer,
    initialDealsForm
  );

  Mousetrap.bind(`shift+d`, () => setOpenDeal(true));

  useEffect(() => {
    if (organizationId) {
      dispatchFormData({
        type: 'set',
        input: 'contact_organization_id',
        payload: organizationId,
      });
    }
  }, [profileInfo]);

  const toggle = () => {
    setOpenDeal(!openDeal);
    setOpenList && setOpenList(false);
  };

  const onClose = () => {
    onHandleCloseModal(dispatchFormData, toggle, 'reset-Form');
    setModalSize('sm');
  };

  const onHandleSubmit = async () => {
    setLoading(true);
    if (
      !dealFormData.contact_organization_id &&
      !dealFormData.contact_organization_new
    ) {
      setLoading(false);
      setErrorMessage(EMPTY_ORG_NAME);
      return setError(EMPTY_ORG_NAME);
    }

    if (!dealFormData.name.trim()) {
      setLoading(false);
      setErrorMessage(EMPTY_DEAL_NAME);
      return setError(EMPTY_DEAL_NAME);
    }

    if (dealFormData.amount && !dealFormData.currency) {
      setLoading(false);
      setErrorMessage(EMPTY_CURRENCY);
      return setError(EMPTY_CURRENCY);
    }
    dealFormData.sales_stage = dealFormData.deal_type || 'cold';

    const products = dealFormData?.products.filter(
      ({ product_id }) => product_id
    );
    const dataDeal = { ...dealFormData, products };

    const newDeal = await dealService.createDeal(dataDeal).catch((err) => {
      setErrorMessage(err.messgae);
      setError(err.message);
    });

    if (newDeal) {
      await Promise.all(
        preOwners?.map(async (item) => {
          await new Promise((resolve) => {
            dealService.addOwner(newDeal?.data?.id, item.user_id).then(resolve);
          });
        })
      );

      dispatchFormData({
        type: 'reset-dealForm',
      });

      dispatchFormData({
        type: 'set',
        input: 'currency',
        payload: 'USD',
      });
      setPreOwners([]);
      setSuccessMessage(DEAL_CONTACT);
      setSuccess(DEAL_CONTACT);

      toggle();

      if (fromNavbar) {
        history.push(`${routes.dealsPipeline}/${newDeal?.data?.id}`);
      }
    }

    setTimeout(() => {
      setLoading(false);
      onGetDeals && onGetDeals();
    }, 3000);
  };

  const toggleModalSize = (addProductsClicked) => {
    setModalSize(addProductsClicked ? 'xl' : 'sm');
  };

  return (
    <>
      <SimpleModalCreation
        modalTitle={ADD_DEAL}
        open={openDeal}
        handleSubmit={onHandleSubmit}
        onHandleCloseModal={onClose}
        errorMessage={error || errorMessage}
        setErrorMessage={setError || setErrorMessage}
        isLoading={loading}
        toggle={onClose}
        onClick={() => document.dispatchEvent(new MouseEvent('click'))}
        customModal={modalSize === 'xl' ? 'modal-dialog-deals' : ''}
        bodyClassName="p-0 mt-2 borderline-top"
        size={modalSize}
      >
        <DealForm
          dispatch={dispatchFormData}
          dealFormData={openDeal ? dealFormData : {}}
          profileInfo={profileInfo}
          searchValue={searchValue}
          isprincipalowner="true"
          prevalue="true"
          preowners={preOwners}
          setPreOwners={setPreOwners}
          initialDeals={initialDeals}
          toggleModalSize={toggleModalSize}
          selectedStage={selectedStage}
        />
      </SimpleModalCreation>
      {children}

      <AlertWrapper className="alert-position">
        <Alert
          color="danger"
          message={error || errorMessage}
          setMessage={setError || setErrorMessage}
        />
        <Alert
          color="success"
          message={success || successMessage}
          setMessage={setSuccess || setSuccessMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default AddDeal;
