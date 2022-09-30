import React, { useEffect, useReducer, useState } from 'react';

import OverviewCard from './OverviewCard';
import OverviewForm from './OverviewForm';
import {
  iconByTypeField,
  reducer,
  VIEW_CARD,
  VIEW_CUSTOM,
  VIEW_FORM,
} from '../../peoples/constantsPeople';
import fieldService from '../../../services/field.service';
import stringConstants from '../../../utils/stringConstants.json';
import CustomFieldsForm from '../../peoples/CustomFieldsForm';
import AlertWrapper from '../../Alert/AlertWrapper';
import Alert from '../../Alert/Alert';

const constants = stringConstants.deals;

const Overview = ({ data, getProfileInfo, isPrincipalOwner }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(VIEW_CARD);
  const [activeCustom, setActiveCustom] = useState(false);

  const [customFields, dispatch] = useReducer(reducer, []);

  const currentView = 'contact';

  const saveFields = () => {
    if (customFields.length > 0) {
      const promises = customFields.map((item, index) => {
        const {
          id,
          name,
          type: { field_type },
        } = item;

        const field = {
          key: name,
          order: index,
          field_type,
        };

        if (id) {
          field.id = id;
        }

        return fieldService.upsetFieldByType(field, currentView);
      });

      Promise.all(promises)
        .then(() => {
          setSuccessMessage(
            constants.organizations.profile.overview.messageSaveCustomField
          );
        })
        .catch((e) => {
          if (e?.response?.data?.error) {
            setErrorMessage(e?.response?.data?.error);
          }
        })
        .finally(() => {
          getProfileInfo();
          getData();
        });
    }
  };

  const onHandleClickSaveFields = () => {
    if (!activeCustom) {
      setEditMode(VIEW_CUSTOM);
    } else {
      setEditMode(VIEW_CARD);
      saveFields();
    }

    setActiveCustom((activeCustom) => !activeCustom);
  };

  const getData = async () => {
    await fieldService
      .getFieldsByType(currentView, {})
      .then((result) => {
        const { data } = result;

        const payload = data?.data.map((item) => {
          const { key, field_type } = item;
          return {
            ...item,
            name: key,
            type: { ...iconByTypeField(field_type) },
          };
        });

        dispatch({ type: 'create', payload });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="card">
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <div className="card-header py-2">
        <h4 className="card-title">
          {constants.contacts.profile.overviewTitle}
        </h4>
        {isPrincipalOwner && (
          <div className="ml-auto">
            <button
              className="btn btn-icon btn-sm btn-ghost-primary rounded-circle"
              title="Edit all fields"
              onClick={() => {
                setEditMode(VIEW_FORM);
                setActiveCustom(false);
              }}
            >
              <i className="material-icons-outlined">edit</i>
            </button>
            <button
              className={`btn btn-sm btn-${
                activeCustom ? 'primary' : 'white'
              } ml-2`}
              onClick={onHandleClickSaveFields}
            >
              {activeCustom ? 'Save' : 'Custom Fields'}
            </button>
          </div>
        )}
      </div>

      {editMode === VIEW_FORM && (
        <OverviewForm
          overviewData={data}
          setEditMode={setEditMode}
          setSuccessMessage={setSuccessMessage}
          setErrorMessage={setErrorMessage}
          getProfileInfo={getProfileInfo}
          customFields={customFields}
        />
      )}
      {editMode === VIEW_CARD && <OverviewCard overviewData={data} />}
      {editMode === VIEW_CUSTOM && (
        <CustomFieldsForm
          state={customFields}
          dispatch={dispatch}
          currentView={currentView}
        />
      )}
    </div>
  );
};

export default Overview;
