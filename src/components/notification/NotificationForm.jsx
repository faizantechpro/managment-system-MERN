import React, { useState, useEffect } from 'react';

import Loading from '../Loading';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';
import IdfCheckbox from '../idfComponents/idfFormInput/IdfCheckbox';
import notificationService from '../../services/notification.service';
import IdfTooltip from '../idfComponents/idfTooltip';
import IdfIcon from '../idfComponents/idfIcon';
import stringConstants from '../../utils/stringConstants.json';
import IdfDropdownSelect from '../idfComponents/idfDropdown/IdfDropdownSelect';

const constants = stringConstants.settings.notifications;

const NotificationForm = () => {
  const [disableDeactivateButton, setDisableDeactivateButton] = useState(true);
  const [settings, setSettings] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const numberOfHours = Array.apply(null, { length: 23 }).map(
    Number.call,
    (item) => Number(item + 1)
  );
  const timeUnits = ['hours', 'days'];
  const defaultSettings = {
    dealsUpdates: false,
    mentionsAndComments: false,
    associations: false,
    updatesTime: '',
    remindMyActivities: false,
    remindTime: '',
    customRemindTime: {
      amount: 5,
      unit: 'hours',
    },
    separateActivities: false,
  };

  const getSettings = async () => {
    try {
      const { settings } = await notificationService.getSettings();
      setSettings(settings);
    } catch (error) {
      setSettings(defaultSettings);
    }
  };

  const setDefaultSettings = async () => {
    setSettings(defaultSettings);
  };

  const onChange = (e) => {
    const { name, checked } = e.target;
    setSettings({ ...settings, [name]: checked });
  };

  const onRadioChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const onSubmit = async () => {
    try {
      await notificationService.addSettings(settings);
      setSuccessMessage(constants.successMessage);
    } catch (error) {
      setErrorMessage(constants.errorMessage);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      const settingsValues = Object.values(settings);
      const trueValues = settingsValues.filter((value) => value === true);
      setDisableDeactivateButton(trueValues.length === 0);
    }
  }, [settings]);

  return (
    <>
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>

      {settings === undefined ? (
        <Loading />
      ) : (
        <div id="password" className="card mb-3 mb-lg-5">
          <>
            <div className="card-header">
              <h4 className="card-title">{constants.emailUpdateTitle}</h4>
            </div>
            <div className="card-body">
              <p className="card-text">{constants.emailUpdateDescription}</p>

              <h4 className="mt-4">{constants.emailsAboutTitle}</h4>
              <IdfCheckbox
                onChange={onChange}
                checked={settings?.dealsUpdates}
                name="dealsUpdates"
                label={
                  <span>
                    Notifications about deals updates{' '}
                    <IdfTooltip text="If you are ther owner or you follow">
                      <IdfIcon icon="help_outline" />
                    </IdfTooltip>
                  </span>
                }
              />
              <IdfCheckbox
                onChange={onChange}
                checked={settings?.mentionsAndComments}
                name="mentionsAndComments"
                label="Notifications about mentions in comments and notes"
              />
              <IdfCheckbox
                onChange={onChange}
                checked={settings?.associations}
                name="associations"
                label="Notifications when your are asigned to deal, contact and organizations"
              />
              <IdfCheckbox
                onChange={onChange}
                checked={settings?.activityGuests}
                name="activityGuests"
                label="Notifications when added as guest to activities"
              />

              <h4 className="mt-4">
                Time
                <IdfTooltip text="We will only send these email if there have been notifications in the selected time period">
                  <IdfIcon icon="help_outline" />
                </IdfTooltip>
              </h4>
              <IdfCheckbox
                onChange={onChange}
                checked={settings?.updatesTime === ''}
                name="updatesTime"
                type="radio"
                label="Real Time"
              />

              <h4 className="mt-6">{constants.remindersTitle}</h4>
              <hr />
              <p>{constants.remindersDescription}</p>
              <h4 className="mt-4">{constants.remindersAboutTitle}</h4>
              <IdfCheckbox
                onChange={onChange}
                name="remindMyActivities"
                checked={settings?.remindMyActivities}
                label="My activities"
              />

              <h4 className="mt-4">Time</h4>
              <IdfCheckbox
                onChange={onRadioChange}
                checked={settings?.remindTime === ''}
                value=""
                name="remindTime"
                type="radio"
                label="Real Time"
              />
              <IdfCheckbox
                onChange={onRadioChange}
                checked={settings?.remindTime === '07:00'}
                value="07:00"
                name="remindTime"
                type="radio"
                label="Same day at 7 AM"
              />
              <IdfCheckbox
                onChange={onRadioChange}
                checked={settings?.remindTime === '20:00'}
                value="20:00"
                name="remindTime"
                type="radio"
                label="Previous day at 8 PM"
              />

              {/* temporarily disabled */}
              {false && (
                <>
                  <IdfCheckbox
                    onChange={onRadioChange}
                    checked={settings?.remindTime === 'custom'}
                    value="custom"
                    name="remindTime"
                    type="radio"
                    label="Custom"
                  />

                  {settings?.remindTime === 'custom' && (
                    <div className="mt-2 d-flex align-items-center ">
                      <IdfDropdownSelect
                        value={settings?.customRemindTime?.amount}
                        list={numberOfHours}
                        onHandleChange={(selected) => {
                          setSettings((prev) => ({
                            ...prev,
                            customRemindTime: {
                              ...prev.customRemindTime,
                              amount: selected,
                            },
                          }));
                        }}
                      />
                      <IdfDropdownSelect
                        cssClass={'ml-2'}
                        value={settings?.customRemindTime?.unit}
                        list={timeUnits}
                        onHandleChange={(selected) => {
                          setSettings((prev) => ({
                            ...prev,
                            customRemindTime: {
                              ...prev.customRemindTime,
                              unit: selected,
                            },
                          }));
                        }}
                      />
                      <span className="ml-2">before activity</span>
                    </div>
                  )}
                </>
              )}

              <h4 className="mt-4">{constants.aditionalOptionsTitle}</h4>
              <IdfCheckbox
                onChange={onChange}
                checked={settings?.separateActivities}
                name="separateActivities"
                label="Separate emails about each activity"
              />
              <div className="mt-4 text-right">
                <button
                  className="btn btn-white"
                  data-dismiss="modal"
                  disabled={disableDeactivateButton}
                  onClick={setDefaultSettings}
                >
                  {constants.deactivateButton}
                </button>
                <button
                  className="btn btn-primary ml-2"
                  data-dismiss="modal"
                  onClick={onSubmit}
                >
                  {constants.saveButton}
                </button>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default NotificationForm;
