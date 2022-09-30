import { useState } from 'react';
import ImportProfile from './ImportProfile';
import RocketReachPeopleCard from './RocketReachPeopleCard';
import RocketReachViewInfoCard from './RocketReachViewInfoCard';
import contactService from '../../../services/contact.service';
import ButtonIcon from '../../commons/ButtonIcon';
import routes from '../../../utils/routes.json';
import { useHistory } from 'react-router-dom';

const ProspectCard = ({ organization, prospect }) => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const history = useHistory();

  const importContact = async () => {
    setLoadingImport(true);

    const dataContact = {
      first_name: prospect.first_name,
      last_name: prospect.last_name,
      email_work: prospect.work_email,
      phone_work: prospect.work_phone,
      avatar: prospect.profile_pic,
      title: prospect.title,
      primary_address_city: prospect.city,
      primary_address_state: prospect.state,
      external_id: '' + prospect.id,
      organization_id: organization.id || null, // importing contact and added as contact in current opened organization
    };

    const { data } = await contactService.createContact(dataContact);

    setLoadingImport(false);
    setOpenImportModal(false);
    history.push(`${routes.contacts}/${data.id}/profile`);
  };

  return (
    <div key={prospect.id} className="card mb-3">
      <div className="card-body p-3">
        <RocketReachPeopleCard prospect={prospect} />

        <hr className="my-3 mx-n3" />

        <RocketReachViewInfoCard prospect={prospect} />

        <ImportProfile
          openImportModal={openImportModal}
          setOpenImportModal={setOpenImportModal}
          prospect={prospect}
          loading={loadingImport}
          handleImport={importContact}
        >
          <ButtonIcon
            icon="add"
            onclick={() => setOpenImportModal(true)}
            color="success"
            label="Import Profile"
            classnames="btn-sm btn-block"
          />
        </ImportProfile>
      </div>
    </div>
  );
};

export default ProspectCard;
