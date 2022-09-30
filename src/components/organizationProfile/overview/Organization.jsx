import React, { useState, useReducer, useEffect } from 'react';

import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import OrganizationCard from './OrganizationCard';
import stringConstants from '../../../utils/stringConstants.json';
import OrganizationOverviewForm from './OrganizationOverviewForm';
import CustomFieldsForm from '../../peoples/CustomFieldsForm';
import {
  VIEW_CARD,
  VIEW_CUSTOM,
  VIEW_FORM,
  iconByTypeField,
  reducer,
} from '../../peoples/constantsPeople';
import fieldService from '../../../services/field.service';

const constants = stringConstants.deals.contacts.profile;

const Organization = ({
  data,
  getProfileInfo,
  isPrincipalOwner,
  setProfileInfo,
  updateLabel,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(VIEW_CARD);
  const [activeCustom, setActiveCustom] = useState(false);

  const [customFields, dispatch] = useReducer(reducer, []);

  const currentView = 'organization';

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
            stringConstants.deals.organizations.profile.overview
              .messageSaveCustomField
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

  const onHandleClickSaveFields = () => {
    if (!activeCustom) {
      setEditMode(VIEW_CUSTOM);
    } else {
      setEditMode(VIEW_CARD);
      saveFields();
    }

    setActiveCustom((activeCustom) => !activeCustom);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <div className="card">
        <div className="card-header py-2">
          <h4 className="card-title">{constants.overviewTitle}</h4>
          {isPrincipalOwner && (
            <div className="ml-auto">
              {editMode === VIEW_CARD && (
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
              )}
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
          <OrganizationOverviewForm
            data={data}
            setEditMode={setEditMode}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
            getProfileInfo={getProfileInfo}
            customFields={customFields}
            setProfileInfo={setProfileInfo}
            updateLabel={updateLabel}
          />
        )}
        {editMode === VIEW_CARD && <OrganizationCard data={data} />}
        {editMode === VIEW_CUSTOM && (
          <CustomFieldsForm
            state={customFields}
            dispatch={dispatch}
            currentView={currentView}
          />
        )}
      </div>
    </>
  );
};

export default Organization;
