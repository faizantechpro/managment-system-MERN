import { useEffect, useState } from 'react';
import { FormGroup } from 'react-bootstrap';
import { Label } from 'reactstrap';

import contactService from '../../../services/contact.service';
import IdfDropdownSearchWithButtonSelect from './IdfDropdownSearchWithButtonSelect';

const IdfAddUserToListWithButtonSelect = (props) => {
  const { title, placeholder, label, setEmails, organizationId } = props;

  const [usersData, setUsersData] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [searchUser, setSearchUser] = useState({
    search: '',
  });

  useEffect(() => {
    if (setSelectedUser) {
      setEmails(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    onGetContacts();
  }, [searchUser.search]);

  async function onGetContacts() {
    const response = await contactService
      .getContactsByorganizationId(
        {
          organizationId,
          ...searchUser,
        },
        {
          page: 1,
          limit: 100,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    setUsersData(response?.contacts);
  }

  const removeTag = (id) => {
    const newValues = selectedUser.filter((tag) => tag.id !== id);

    setSelectedUser(newValues);
  };

  const stateChange = (e) => {
    setSearchUser({
      ...searchUser,
      search: e.target.value,
    });
  };

  return (
    <FormGroup>
      <Label htmlFor="selectLessonDropdown">{label}</Label>
      <IdfDropdownSearchWithButtonSelect
        id="selectUser"
        title={title}
        placeholder={placeholder}
        name="selectUser"
        data={usersData}
        showAvatar
        selection={selectedUser}
        setSelection={setSelectedUser}
        onChange={stateChange}
        removeTag={removeTag}
      />

      {!!selectedUser.length && (
        <ul className="tags">
          {selectedUser?.map((tag) => (
            <li key={tag.id} className="tag tag-primary">
              <span className="tag-title">{tag.name}</span>
              <i
                className="tag-close-icon tag-primary"
                onClick={() => removeTag(tag.id)}
              >
                x
              </i>
            </li>
          ))}
        </ul>
      )}
    </FormGroup>
  );
};
export default IdfAddUserToListWithButtonSelect;
