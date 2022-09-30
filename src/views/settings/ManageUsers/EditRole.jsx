import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ValidateAdminAccess from '../../../components/validateAdminAccess/ValidateAdminAccess';

import {
  Card,
  CardForm,
  CardHeader,
  CardBlock,
  CardContent,
  CardSection,
  CardSide,
  CardTitle,
  CardSubtitle,
  CardSubContent,
  TextInput,
  DropdownSearch,
  CardButton,
  List,
  Item,
  ItemAvatar,
  ItemUser,
  ItemActions,
  SwitchInput,
} from '../../../components/layouts/CardLayout';
import Alert from '../../../components/Alert/Alert';
import roleService from '../../../services/role.service';
import userService from '../../../services/user.service';
import stringConstants from '../../../utils/stringConstants.json';
import permissions from '../../../utils/permissions.json';
import { isAlphanumeric } from '../../../utils/Utils';
import Avatar from '../../../components/Avatar';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import { PermissionsContext } from '../../../contexts/permissionContext';

const constants = stringConstants.settings.roles.edit;

const permissionList = permissions.permissionList;

const role = {
  name: '',
  description: '',
  id: '',
  isAdmin: false,
};

const buttons = {
  save: {
    title: constants.saveRole,
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

const switches = {
  admin: {
    isAdmin: {
      id: 'sw-is-admin',
      label: constants.isAdmin,
    },
  },
  owner: {
    isOwner: {
      id: 'sw-is-owner',
      label: constants.isOwner,
    },
  },
};

const EditRoles = () => {
  const [roleData, setRoleData] = useState(role);
  const [searchUser, setSearchUser] = useState({});
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [userSelection, setUserSelection] = useState([{}]);
  const [initialRoleUsers, setInitialRoleUsers] = useState([{}]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [inputSearchError, setInputSearchError] = useState({});
  const [adminAccessSwitch, setAdminAccessSwitch] = useState(false);
  const [ownerAccessSwitch, setOwnerAccessSwitch] = useState(false);
  const [permissionSwitches, setPermissionSwitches] = useState({});

  const { permissionChanges, setPermissionChanges } =
    useContext(PermissionsContext);

  const onInputChange = (e) => {
    const { name, value } = e.target || {};
    setRoleData({
      ...roleData,
      [name]: value,
    });
  };

  const alphanumericError = (input) => {
    const msgError = 'Only alphanumeric characters are allowed';
    if (input === 'search') {
      setInputSearchError({ error: true, msg: msgError });
      setTimeout(() => setInputSearchError({ error: false, msg: '' }), 3500);
    }
  };

  const onInputSearch = (e) => {
    const { value } = e.target || {};
    isAlphanumeric(value)
      ? setSearchUser({
          ...searchUser,
          search: value,
        })
      : alphanumericError(`search`);
  };

  const roleId = useParams();

  const deleteUserItem = async (itemIndex) => {
    const updatedUsers = userSelection.filter(
      (item, index) => index !== itemIndex
    );
    setUserSelection(updatedUsers);
  };

  // Update role service
  const updateRole = () => {
    return new Promise((resolve, reject) => {
      roleData.id = roleId.id;
      roleData.isAdmin = adminAccessSwitch || false;
      roleData.isOwner = ownerAccessSwitch || false;

      userSelection.length > 0 &&
        userSelection.forEach(async (user) => {
          const checkIfExist = initialRoleUsers.some(
            (item) => item.id === user.id
          );

          if (!checkIfExist) {
            const userUpdate = {
              id: user.id,
              role: roleId.id,
              roleService: true,
            };

            userService
              .updateUserInfoById(user.id, userUpdate)
              .catch((err) => console.log(err));
          }
        });

      initialRoleUsers.length > 0 &&
        initialRoleUsers.forEach(async (user) => {
          const checkIfExist = userSelection.some(
            (item) => item.id === user.id
          );

          if (!checkIfExist) {
            const userUpdate = {
              id: user.id,
              role: null,
              roleService: true,
            };

            userService
              .updateUserInfoById(user.id, userUpdate)
              .catch((err) => console.log(err));
          }
        });

      setInitialRoleUsers(userSelection);

      return roleService.updateRole(roleData).then(resolve).catch(reject);
    });
  };

  const getRoleById = () => {
    const roleById = roleService.getRoleById(roleId.id);
    roleById &&
      roleById.then((roleResult) => {
        setRoleData({
          name: roleResult.name || '',
          description: roleResult.description || '',
          id: roleResult.id || '',
          isAdmin: roleResult.isAdmin || '',
        });
        setAdminAccessSwitch(roleResult.admin_access || '');
        setOwnerAccessSwitch(roleResult.owner_access || '');
      });
  };

  const getRoleUsers = async () => {
    const response = await userService
      .getUsers({ role: roleId.id }, { limit: 20 })
      .catch((err) => console.log(err));

    const roleUsers = response.data.users;

    const roleUsersList = roleUsers.map((user) => {
      const roleUsersItem = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        avatar: user.avatar,
        id: user.id,
        role: user.role,
      };

      return roleUsersItem;
    });
    setUserSelection(roleUsersList);
    setInitialRoleUsers(roleUsersList);
  };

  const getRolePermissions = async () => {
    const rolePermissions = await roleService
      .getPermissionsByRole(roleId.id)
      .catch((err) => console.log(err));

    setPermissionSwitches({});

    rolePermissions.forEach((permission) => {
      const switchId = `${constants.switch}-${permission.collection}-${permission.action}`;
      setPermissionSwitches((prevState) => ({
        ...prevState,
        [switchId]: true,
      }));
    });
  };

  useEffect(() => {
    getRoleById();
    getRoleUsers();
    getRolePermissions();
  }, []);

  useEffect(async () => {
    const searchResults = await userService
      .getUsers(searchUser, {
        page: 1,
        limit: 10,
      })
      .catch((err) => console.log(err));

    const { data } = searchResults || {};
    setSearchUserResults(data?.users);
  }, [searchUser]);

  useEffect(() => {
    if (adminAccessSwitch) setOwnerAccessSwitch(false);
  }, [adminAccessSwitch]);

  useEffect(() => {
    if (ownerAccessSwitch) setAdminAccessSwitch(false);
  }, [ownerAccessSwitch]);

  const handleSubmit = async () => {
    setIsLoading(true);
    await updateRole();
    setIsLoading(false);

    setToast(constants.roleUpdateSuccess);
    setPermissionChanges(!permissionChanges);
    // TODO: setToast(constants.roleUpdateFailed);
  };

  const handleSwitchEvent = async (e) => {
    setIsLoading(true);
    const checked = e.target.checked;
    const collectionName = e.target.id.split('-')[1];
    const actionName = e.target.id.split('-')[2];

    if (!checked) {
      await roleService.updatePermissions(roleId.id, {
        collection: collectionName,
        action: actionName,
        fields: null,
      });
    } else {
      const collection = permissionList.find((item) => {
        return item.name === collectionName;
      });
      const action = collection?.group?.find((item) => {
        return item.name === actionName;
      });
      await Promise.all(
        action.permissions.map(async (permission) => {
          await roleService.updatePermissions(roleId.id, {
            collection: permission.collection,
            action: permission.action,
            fields: '*',
          });
        })
      );
    }
    await getRolePermissions();
    setIsLoading(false);
  };

  return (
    <>
      <AlertWrapper>
        <Alert message={toast} setMessage={setToast} color="success" />
      </AlertWrapper>
      <Card>
        <CardHeader>
          <CardTitle>{constants.title}</CardTitle>
          <CardButton
            title={buttons.save.title}
            variant={buttons.save.variant}
            onClick={handleSubmit}
            isLoading={isLoading}
          />
        </CardHeader>
        <CardForm>
          <CardSection endLine>
            <CardBlock>
              <TextInput
                label={constants.name}
                name={`name`}
                value={roleData.name}
                onChange={onInputChange}
              />
              <TextInput
                label={constants.description}
                name={`description`}
                value={roleData.description}
                onChange={onInputChange}
              />
            </CardBlock>
          </CardSection>
          <CardSection>
            <CardContent>
              <CardSubtitle endLine>{constants.users}</CardSubtitle>
              <CardSubContent>
                <DropdownSearch
                  id={`selectUsersDropdown`}
                  roleId={roleId.id}
                  title={constants.usersSearchTitle}
                  placeholder={constants.usersSearchPlaceholder}
                  value={searchUser}
                  onChange={onInputSearch}
                  results={searchUserResults}
                  error={inputSearchError}
                  selection={userSelection}
                  setSelection={setUserSelection}
                />
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
                              deleteUserItem(index);
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
            <CardSide>
              <CardSubtitle endLine>{constants.adminPermissions}</CardSubtitle>
              <CardSubContent>
                <ValidateAdminAccess onlyAdmin>
                  <SwitchInput
                    id={switches.admin.isAdmin.id}
                    label={switches.admin.isAdmin.label}
                    checked={adminAccessSwitch}
                    onChange={() => setAdminAccessSwitch(!adminAccessSwitch)}
                  />
                </ValidateAdminAccess>
                <SwitchInput
                  id={switches.owner.isOwner.id}
                  label={switches.owner.isOwner.label}
                  checked={ownerAccessSwitch}
                  onChange={() => setOwnerAccessSwitch(!ownerAccessSwitch)}
                />
              </CardSubContent>

              {permissionList.length > 0 &&
                permissionList.map((permissionsCategory) => {
                  return (
                    <div key={permissionsCategory.name}>
                      <CardSubtitle endLine>
                        {permissionsCategory.label}
                      </CardSubtitle>
                      <CardSubContent>
                        {permissionsCategory.group.length > 0 &&
                          permissionsCategory.group.map((permissionGroup) => {
                            const switchId = `${constants.switch}-${permissionsCategory.name}-${permissionGroup.name}`;

                            return (
                              <SwitchInput
                                key={switchId}
                                id={switchId}
                                label={permissionGroup.label}
                                checked={permissionSwitches[switchId] || false}
                                onChange={(e) => handleSwitchEvent(e)}
                                disabled={isLoading}
                              />
                            );
                          })}
                      </CardSubContent>
                    </div>
                  );
                })}
            </CardSide>
          </CardSection>
        </CardForm>
      </Card>
    </>
  );
};

export default EditRoles;
