import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import './AddActivity.css';
import TextInput from '../../inputs/TextInput';
import { ButtonsGroup, CardButton } from '../../layouts/ActivityLayout';
import stringConstants from '../../../utils/stringConstants.json';
import DatePickerInput from '../../inputs/DateRange/DatePickerInput';
import DropdownSearchSelect from '../../inputs/DropdownSearchSelect';
import CheckBoxInput from '../../inputs/CheckBoxInput';
import organizationService from '../../../services/organization.service';
import activityService from '../../../services/activity.service';
import { isAlphanumeric } from '../../../utils/Utils';
import feedService from '../../../services/feed.service';
import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import userService from '../../../services/user.service';
import AddActivityOptions from './AddActivityOptions';
import IdfSelectOrganization from '../../idfComponents/idfDropdown/IdfSelectOrganization';
import IdfSelectDeal from '../../idfComponents/idfDropdown/IdfSelectDeal';
import AddNote from './AddNote';
import { ModalFooter } from 'react-bootstrap';
import routes from '../../../utils/routes.json';

const activityConstants = stringConstants.deals.contacts.profile.activities;
const alphanumericConstants = stringConstants.settings.users.filters;

const AddActivity = (props) => {
  const {
    componentId,
    contactId,
    dealId,
    organizationId,
    feedId,
    getProfileInfo,
    isModal,
    closeModal,
    activityData,
    contactInfo,
    fromNavbar,
    profileInfo,
    feedInfo,
    searchValue,
  } = props;

  const history = useHistory();

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [btnGroupValue, setBtnGroupValue] = useState('callActivity');
  const [nameActivity, setNameActivity] = useState();
  const [location, setLocation] = useState('');
  const [conferenceLink, setConferenceLink] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [richNote, setRichNote] = useState(null);
  const [openNote, setOpenNote] = useState(false);
  const [tagifyValue, setTagifyValue] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [tagifyDropdownlist, setTagifyDropdownlist] = useState([]);
  const [searchOwner, setSearchOwner] = useState({});
  const [searchOwnerResults, setSearchOwnerResults] = useState([]);
  const [ownerInputSearchError, setOwnerInputSearchError] = useState({});
  const [ownerSelection, setOwnerSelection] = useState({});
  const [userData, setUserData] = useState([{}]);
  const [isDone, setIsDone] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [initialStartDate, setInitialStartDate] = useState('');
  const [flagFirtsRender, setFlagFirtsRender] = useState(true);
  const [reset, setReset] = useState(false);
  const [user, setUser] = useState({});
  const [checkOption, setCheckOption] = useState(true);
  const [anotherGuests, setAnotherGuests] = useState([]);
  const [freeBusy, setFreeBusy] = useState(
    activityConstants.freeBusy.options[0]
  );
  const [badEmail, setBadEmail] = useState(false);
  const [organizationSelected, setOrganizationSelected] = useState(null);
  const [dealSelected, setDealSelected] = useState(null);
  const [personSelected, setPersonSelected] = useState(null);
  const [dealInfo, setDealInfo] = useState(null);

  const contactActivityButtons = activityConstants.buttons;
  const constants = stringConstants.deals.contacts.profile;
  const regex =
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const alphanumericError = (input) => {
    const msgError = alphanumericConstants.alphanumeric.error;
    if (input === alphanumericConstants.search) {
      setOwnerInputSearchError({ error: true, msg: msgError });
      setTimeout(
        () => setOwnerInputSearchError({ error: false, msg: '' }),
        3500
      );
    }
  };

  const onInputSearch = (e) => {
    const { value } = e.target || {};
    isAlphanumeric(value)
      ? setSearchOwner({
          ...searchOwner,
          search: value,
        })
      : alphanumericError(alphanumericConstants.search);
  };

  useEffect(async () => {
    if (userData) {
      const searchResults = await getUsers(searchOwner.search);
      setSearchOwnerResults(searchResults);
    } else {
      setSearchOwnerResults([]);
    }
  }, [searchOwner, userData]);

  useEffect(() => {
    if (searchValue) {
      setNameActivity(searchValue);
    }
  }, [searchValue]);

  const getUsers = async (search = '') => {
    const result = await userService.getUsers(
      { search, filters: `$filter=status ne 'invited'` },
      { limit: 5 }
    );

    return result.data.users?.map((user) => {
      const name = `${user.first_name} ${user.last_name}`;
      const userItem = {
        value: name,
        name: name,
        email: user.email_work || user.email_home,
        avatar: user.avatar,
        id: user.id,
      };

      return userItem;
    });
  };

  const getUsersList = async (flag = false) => {
    const userList = getUsers();

    if (flagFirtsRender || flag) {
      setFlagFirtsRender(false);
    }

    setUserData(userList);
  };

  const searchGuest = async (search) => {
    setAnotherGuests(
      search.length ? search.split(' ').join('').split(',') : []
    );

    const allGuest = await userService.getMatchingGuests(search);

    const list = allGuest.data?.map((user) => {
      const name = `${user.first_name} ${user.last_name}`;
      const userItem = {
        value: name,
        name: name,
        email: user.email || user.email_work || user.email_home,
        avatar: user.avatar,
        id: user.id,
      };
      return userItem;
    });

    setTagifyDropdownlist(list);
  };

  const getUser = async () => {
    const result = await userService.getUserInfo();
    setUser({
      value: `${result.first_name} ${result.last_name}`,
      name: `${result.first_name} ${result.last_name}`,
      email: result.email,
      avatar: result.avatar,
      id: result.id,
    });
  };

  useEffect(() => {
    getUser();
    getUsersList();
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      setOwnerSelection({
        value: user.name,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        id: user.id,
      });
    }
  }, [user]);

  const getRedirect = () => {
    if (organizationSelected) {
      history.push(
        `${routes.contacts}/${organizationSelected.id}/organization/profile`
      );
    } else if (personSelected) {
      history.push(`${routes.contacts}/${personSelected.id}/profile`);
    } else if (dealSelected) {
      history.push(`${routes.dealsPipeline}/${dealSelected.id}`);
    }
  };

  const saveAndSend = async () => {
    try {
      const list = [];
      anotherGuests.forEach((guest, i) => {
        list.push({
          id: guest,
          value: guest,
          email: guest,
          alert: !regex.test(guest),
        });
        if (i === anotherGuests.length - 1) {
          setTagifyValue([...tagifyValue, ...list]);
          setAnotherGuests([]);
        }
      });

      if (
        anotherGuests.find((item) => !regex.test(item)) ||
        tagifyValue.find((item) => !regex.test(item.email))
      ) {
        return setErrorMessage(constants.emailsNotAllowed);
      }

      const allGuest = [...tagifyValue, ...list];
      const guests = allGuest.map((user) => user.id);
      await feedService.addActivity({
        // contact_id: personSelected?.id,
        contacts: selectedContacts.map((selectedContact) => selectedContact.id),
        contact_info: contactInfo,
        organization_id: organizationSelected?.id,
        deal_id: dealSelected?.id,
        type: btnGroupValue,
        name: nameActivity,
        start_date: startDate,
        guests: guests.toString() || '',
        location: checkOption ? location : '',
        conference_link: checkOption ? '' : conferenceLink,
        description,
        free_busy: freeBusy.name,
        notes,
        rich_note: richNote,
        owner: ownerSelection.id,
        lead: '',
        done: isDone,
      });

      setBtnGroupValue('callActivity');
      setNameActivity('');
      setLocation('');
      setConferenceLink('');
      setDescription('');
      setFreeBusy(activityConstants.freeBusy.options[0]);
      setNotes('');
      setRichNote(null);
      setTagifyValue([]);
      setSearchOwner({});
      setUserData([{}]);
      setIsDone(false);
      setStartDate('');
      setCheckOption(false);
      if (getProfileInfo) getProfileInfo(constants.activityAdded);
      setSuccessMessage(constants.activityAdded);
      setReset(!reset);
      setOwnerSelection({
        value: user.name,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        id: user.id,
      });
      getUsersList(true);
      setPersonSelected(null);
      setDealSelected(null);
      setOrganizationSelected(null);

      if (fromNavbar) {
        setTimeout(() => {
          closeModal(false);
          getRedirect();
        }, 2000);
      }
    } catch (error) {
      if (getProfileInfo) getProfileInfo(constants.activityError);
      setErrorMessage(constants.activityError);
    }
  };

  const updateAndSend = async () => {
    try {
      const guests = tagifyValue.map((user) => user.id);
      await feedService.updateActivityFeed(feedId, activityData.id, {
        type: btnGroupValue,
        name: nameActivity,
        start_date: startDate,
        guests: guests.toString() || '',
        location: checkOption ? location : '',
        conference_link: checkOption ? '' : conferenceLink,
        description,
        free_busy: freeBusy.name,
        notes,
        rich_note: richNote,
        owner: ownerSelection.id,
        lead: '',
        done: isDone,
        contacts: selectedContacts.map((selectedContact) => selectedContact.id),
        // contact_id: personSelected?.id || dealInfo?.contact_person_id,
        organization_id: organizationSelected?.id,
        deal_id: dealSelected?.id,
      });

      if (getProfileInfo) {
        getProfileInfo(constants.activityUpdated);
        closeModal();
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        setErrorMessage(constants.unathorizedError);

        return setTimeout(() => closeModal(false), 2000);
      }

      setErrorMessage(constants.activityError);
    }
  };

  const getUserByIds = async (guests = '') => {
    if (guests === '') {
      return [];
    }

    const guestIds = guests.split(',');
    const result = [];
    const guestUuid = guestIds.filter((guestId) => {
      if (regex.test(guestId)) {
        result.push({
          value: guestId,
          name: guestId,
          email: guestId,
          avatar: '',
          id: guestId,
        });
      }

      return !regex.test(guestId);
    });

    if (guestUuid.length === 0) {
      return [...result];
    }

    const { data: response } = await userService.getGuestsByIds(
      guestUuid.toString()
    );

    const otherData = [...response.users, ...response.contacts]?.map((user) => {
      const name = `${user.first_name} ${user.last_name}`;
      const userItem = {
        value: name,
        name: name,
        email: user.email || user.email_work || user.email_home,
        avatar: user.avatar,
        id: user.id,
      };

      return userItem;
    });

    return [...otherData, ...result];
  };

  const getOwnerById = async (organizationId) => {
    let owner = await organizationService
      .getOrganizationById(organizationId)
      .catch((err) => console.log(err));

    if (!owner) {
      const [result] = await getUserByIds(activityData.owner);
      owner = result;
    }

    return owner;
  };

  const getActivityContactById = async (activityId) => {
    const activityContacts = await activityService
      .getActivityContacts(activityId)
      .catch((err) => console.log(err));

    return activityContacts.map((item) => {
      return {
        value: `${item.first_name} ${item.last_name}`,
        name: `${item.first_name} ${item.last_name}`,
        email: item.email_work,
        avatar: item.avatar,
        id: item.id,
      };
    });
  };

  const setDataEdit = async () => {
    if (feedId) {
      const guests = await getUserByIds(activityData.guests);
      const owner = await getOwnerById(activityData.owner);
      const contacts = await getActivityContactById(activityData.id);

      setOwnerSelection({
        value: owner.name,
        name: owner.name,
        email: owner.email,
        avatar: owner.avatar,
        id: owner.id,
      });

      setSelectedContacts(contacts);
      setInitialStartDate(activityData.start_date);
      setBtnGroupValue(activityData.type);
      setNameActivity(activityData.name);
      setLocation(activityData.location);
      setConferenceLink(activityData.conference_link);
      setDescription(activityData.description);
      setFreeBusy({ name: activityData.free_busy });
      setNotes(activityData.notes);
      setTagifyValue(guests);
      setIsDone(activityData.done);
      setCheckOption(activityData.location?.trim() !== '');
      setOrganizationSelected(feedInfo?.organization?.id);
      setPersonSelected(feedInfo?.contact?.id);
    }
  };

  useEffect(() => {
    setDataEdit();
  }, [feedId]);

  const onSelect = (e) => {
    const {
      target: { name, value },
    } = e || {};

    const callback = {
      contact_organization_id: setOrganizationSelected,
      contact_person_id: setPersonSelected,
      contact_deal_id: setDealSelected,
    };

    callback[name]({
      id: value,
    });
  };

  const resetForm = () => {};

  const notePlaceholder = (
    <div
      className="cursor-pointer text-muted"
      style={{ backgroundColor: '#FFF8BC' }}
    >
      {openNote ? '' : 'Start writing a note...'}
    </div>
  );

  return (
    <div className="pl-2">
      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <TextInput
        id="activity-title"
        labelSize="full"
        placeholder={
          contactActivityButtons.length
            ? contactActivityButtons.find((e) => e.type === btnGroupValue)?.name
            : null
        }
        size={`lg`}
        value={nameActivity}
        onChange={(e) => setNameActivity(e.target.value)}
        formClassName="p-2"
        containerClassName="pr-2 pl-2"
      />
      <ButtonsGroup
        placement="top"
        buttons={contactActivityButtons}
        value={btnGroupValue}
        setValue={setBtnGroupValue}
      />{' '}
      <div className="position-relative">
        <div className="material-icons-outlined pos-icon-schedule">
          <span style={{ opacity: 0.5 }}>schedule</span>
        </div>
        <DatePickerInput
          id={componentId}
          labelSize="full"
          initialStartDate={initialStartDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          reset={reset}
          steps={5}
        />
      </div>
      <AddActivityOptions
        tagifyDropdownlist={tagifyDropdownlist}
        regex={regex}
        constants={constants}
        tagifyValue={tagifyValue}
        setAnotherGuests={setAnotherGuests}
        setTagifyValue={setTagifyValue}
        searchGuest={searchGuest}
        location={location}
        setLocation={setLocation}
        conferenceLink={conferenceLink}
        setConferenceLink={setConferenceLink}
        description={description}
        setDescription={setDescription}
        setBadEmail={setBadEmail}
        endDate={endDate}
        expand={tagifyValue?.length}
      />
      {/* <div className="material-icons-outlined pos-icon-schedule">
        format_align_left
      </div> */}
      <div className="position-relative" onClick={() => setOpenNote(true)}>
        <div className="material-icons-outlined pos-icon-schedule pr-4">
          <span style={{ opacity: 0.5 }}>sticky_note_2</span>
        </div>
        <AddNote
          contactId={contactId}
          organizationId={organizationId}
          getProfileInfo={getProfileInfo}
          dealId={dealId}
          from="activity"
          defaultState={feedInfo?.object_data?.rich_note}
          feedInfoNotes={feedInfo?.object_data?.notes}
          notes={notes}
          setRichNote={setRichNote}
          richNote={richNote}
          placeholder={notePlaceholder}
        />
        <span className="ml-2 text-sm">
          Notes are only visible within Identifee.
        </span>
      </div>
      <div className="position-relative">
        <div className="material-icons-outlined pos-icon-schedule">
          <span style={{ opacity: 0.5 }}>account_circle</span>
        </div>

        <div>
          <DropdownSearchSelect
            id={`selectRoleDropdown`}
            value={searchOwner}
            onChange={onInputSearch}
            onClick={getUsersList}
            results={searchOwnerResults}
            labelSize={`full`}
            placeholder={`Search for user`}
            className={`dropdown-search-select`}
            selection={ownerSelection}
            setSelection={setOwnerSelection}
            ownerInputSearchError={ownerInputSearchError}
          />
        </div>
      </div>
      <div className="position-relative">
        <div className="material-icons-outlined pos-icon-schedule">
          <span style={{ opacity: 0.5 }}>link</span>
        </div>
        <div className="">
          <IdfSelectDeal
            id="contact_deal_id"
            name="contact_deal_id"
            title="Deal Name (Organization Name)"
            onChange={onSelect}
            value={dealId || feedInfo?.deal_id}
            setDealInfo={setDealInfo}
            dealSelected={dealSelected}
          />
        </div>
      </div>
      <div className="position-relative">
        <div>
          {/* <IdfSelectContact
            id="contact_person_id"
            name="contact_person_id"
            title="People Name (person.name@email-address, Organization Name)"
            onChange={onSelect}
            showAvatar
            contact_id={feedInfo?.contact_id}
            value={contactInfo || feedInfo?.contact}
            dealInfo={dealInfo}
            personSelected={personSelected}
          /> */}
          <AddActivityOptions
            tagifyDropdownlist={tagifyDropdownlist}
            regex={regex}
            constants={constants}
            tagifyValue={selectedContacts}
            setAnotherGuests={setAnotherGuests}
            setTagifyValue={setSelectedContacts}
            searchGuest={searchGuest}
            location={location}
            setLocation={setLocation}
            conferenceLink={conferenceLink}
            setConferenceLink={setConferenceLink}
            description={description}
            setDescription={setDescription}
            setBadEmail={setBadEmail}
            endDate={endDate}
            expand={selectedContacts?.length}
            isOpen={true}
          />
        </div>
      </div>
      <div className="position-relative">
        <div className="">
          <IdfSelectOrganization
            id="contact_organization_id"
            name="contact_organization_id"
            title="Organization Name (City and State)"
            onChange={onSelect}
            value={profileInfo || feedInfo?.organization}
            contactInfo={contactInfo}
            dealInfo={dealInfo}
            setOrganizationSelected={setOrganizationSelected}
          />
        </div>
      </div>
      <div className={`btns-confirm-activity`}>
        <ModalFooter>
          <CheckBoxInput
            labelCheckBox={`Mark as done`}
            value={isDone}
            onChange={() => setIsDone(!isDone)}
          />
          <CardButton
            title="Cancel"
            className="btn-white"
            onClick={isModal ? closeModal : resetForm}
          />
          <CardButton
            title={feedId ? 'Update' : 'Save'}
            variant={`primary`}
            onClick={() => (feedId ? updateAndSend() : saveAndSend())}
            disabled={
              badEmail ||
              !nameActivity?.length ||
              !Object.keys(ownerSelection).length ||
              !startDate.length ||
              startDate.includes('Invalid date')
            }
          />
        </ModalFooter>
      </div>
    </div>
  );
};

export default AddActivity;
