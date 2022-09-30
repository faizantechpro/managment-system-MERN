import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';

import {
  Card,
  CardForm,
  CardHeader,
  CardBlock,
  CardContent,
  CardSection,
  CardSide,
  CardTitle,
  // CardSubtitle,
  CardSubContent,
  TextInput,
  CardButton,
  List,
  Item,
  ItemAvatar,
  ItemUser,
  ItemActions,
} from '../../../components/layouts/CardLayout';
import groupService from '../../../services/groups.service';
import userService from '../../../services/user.service';
import stringConstants from '../../../utils/stringConstants.json';
import { isAlphanumeric } from '../../../utils/Utils';
import Avatar from '../../../components/Avatar';
import IdfDropdownSearch from '../../../components/idfComponents/idfDropdown/IdfDropdownSearch';
import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import { groupAttrData } from '../../../utils/constants';

const constants = stringConstants.settings.groups.edit;
const errorAlphanumeric = stringConstants.settings.users.filters.alphanumeric;
const buttons = {
  save: {
    title: constants.saveGroup,
    variant: 'primary',
  },
  remove: {
    title: constants.remove,
    variant: 'outline-danger',
  },
  add: {
    title: constants.add,
    variant: 'outline-primary',
  },
};

const EditGroup = () => {
  const defaultPagination = { page: 1, limit: 20 };
  const [groupData, setGroupData] = useState(groupAttrData);
  const [userSelection, setUserSelection] = useState([{}]);
  const [allParents, setAllParents] = useState([]);
  const [parentGroup, setParentGroup] = useState(null);
  // TODO: All code commented already works, just it continue in the next features...
  // const [allUsers, setAllUsers] = useState([]);
  // const [userSelected, setUserSelected] = useState({});
  const [groupName, setGroupName] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const group = useParams();

  const alphanumericError = (input) => {
    const msgError = errorAlphanumeric.error;
    if (input === 'search') {
      setErrorMessage(msgError);
      setTimeout(() => setErrorMessage(''), 3500);
    }
  };

  const onInputSearch = (e) => {
    const { value } = e.target || {};
    isAlphanumeric(value) ? setGroupName(value) : alphanumericError(`search`);
  };

  const deleteUserItem = async (user) => {
    try {
      await groupService.removeUserFromGroup({
        users: user,
      });
      getUsersByGroup();
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const getGroupById = async () => {
    try {
      const groupInfo = await groupService.getGroupById(group.id);
      if (groupInfo) {
        setParentGroup(groupInfo.parent ? groupInfo.parent : {});
        setGroupName(groupInfo.name);
        setGroupData(groupInfo);
      }
    } catch (error) {
      setErrorMessage(constants.errorGetGroups);
    }
  };

  const getListGroups = async (search) => {
    const result = await groupService.getGroups({ search }, defaultPagination);
    const { data } = result;
    const parents = data.filter((item) => !item.parent);
    setAllParents(parents);
  };

  const getUsersByGroup = async () => {
    const response = await userService
      .getUsers({ group_id: group.id }, { limit: 20 })
      .catch((err) => console.log(err));

    const groupUsers = response?.data?.users;
    const groupUsersList = groupUsers.map((user) => {
      const groupUsersItem = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar: user.avatar,
        id: user.id,
        role: user.role,
      };

      return groupUsersItem;
    });
    setUserSelection(groupUsersList);
  };

  const findUsers = async (search) => {
    // const result = await userService.getUsers(
    //   { search },
    //   {
    //     page: 1,
    //     limit: 5,
    //   }
    // );
    // const { data } = result || {};
    // setAllUsers(data.users);
  };

  useEffect(() => {
    getGroupById();
    // getUsersByGroup();
    getListGroups();
    findUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      await groupService.updateGroup({
        id: groupData.id,
        name: groupName,
        parent_id: parentGroup?.id ? parentGroup.id : null,
        // users: userSelected,
      });
      // getUsersByGroup();
      setSuccessMessage(constants.groupUpdateSuccess);
    } catch (error) {
      setErrorMessage(constants.groupUpdateFailed);
    }
  };

  return (
    <>
      <AlertWrapper>
        <Alert
          color="success"
          message={successMessage}
          setMessage={setSuccessMessage}
        />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
      <Card>
        <CardHeader>
          <CardTitle>{constants.title}</CardTitle>
          <CardButton
            title={buttons.save.title}
            variant={buttons.save.variant}
            onClick={handleSubmit}
          />
        </CardHeader>
        <CardForm>
          <CardSection endLine className="px-1 py-2">
            <CardBlock>
              <TextInput
                classNameLabel="pl-1"
                name={`name`}
                label={constants.name}
                value={groupName}
                onChange={(e) => onInputSearch(e)}
              />
              <Row>
                <h5 className="label-mw pl-1 col-form-label form-label font-size-sm col">{`Parent Group`}</h5>
                <IdfDropdownSearch
                  id="assigned_parent"
                  className="ml-3 border-0 w-90"
                  title="Select Parent Group"
                  name="assigned_parent"
                  showAvatar={false}
                  customTitle={'name'}
                  onChange={(e) => getListGroups(e ? e.target.value : null)}
                  data={allParents}
                  value={parentGroup?.name}
                  onHandleSelect={(_, item) => setParentGroup(item)}
                />
              </Row>
            </CardBlock>
          </CardSection>
          <CardSection>
            <CardContent>
              {/* <CardSubtitle endLine>{constants.users}</CardSubtitle> */}
              <CardSubContent>
                {/* <DropdownSearch
                  data={allUsers}
                  id={`selectUsersDropdown`}
                  name="assigned_puser"
                  title={constants.usersSearchTitle}
                  placeholder={constants.usersSearchPlaceholder}
                  onChange={(e) => findUsers(e ? e.target.value : null)}
                  selected={userSelected?.name}
                  onHandleSelect={(item) => setUserSelected(item)}
                /> */}
                <List>
                  {userSelection
                    .filter((value) => Object.keys(value).length !== 0)
                    .map((user, index) => (
                      <Item id={`user-${index}`} key={index}>
                        <ItemAvatar>
                          <Avatar user={user} classModifiers="mr-2" />
                        </ItemAvatar>

                        <ItemUser name={user.name} email={user.email} />
                        <ItemActions>
                          <CardButton
                            title={buttons.remove.title}
                            variant={buttons.remove.variant}
                            onClick={() => {
                              deleteUserItem(user);
                            }}
                          />
                        </ItemActions>
                      </Item>
                    ))}
                  {userSelection.filter(
                    (value) => Object.keys(value).length !== 0
                  ).length < 1 && (
                    <p className="text-muted text-center">{`No users`}</p>
                  )}
                </List>
              </CardSubContent>
            </CardContent>
            <CardSide>{/* TODO: Lack add other components */}</CardSide>
          </CardSection>
        </CardForm>
      </Card>
    </>
  );
};

export default EditGroup;
