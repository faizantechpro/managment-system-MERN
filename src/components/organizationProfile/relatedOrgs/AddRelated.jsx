import React, { useState, useEffect } from 'react';

import SimpleModal from '../../modal/SimpleModal';
import DropdownSearch from '../../DropdownSearch';
import OrgRelatedList from './OrgRelatedList';
import organizationService from '../../../services/organization.service';
import stringConstants from '../../../utils/stringConstants.json';

const constants = stringConstants.deals.organizations.profile;

const AddRelated = ({
  organizationId,
  getRelated,
  showAddRelatedModal,
  setShowAddRelatedModal,
  children,
  onHandleShowAlertSuccess,
  onHandleShowAlertFailed,
  handleRemove,
  allRelatedOrgs,
  isPrincipalOwner,
  mainOwner,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState(null);
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);
  const relations = [
    { id: 0, name: 'Parent' },
    { id: 1, name: 'Daughter' },
    { id: 2, name: 'Related' },
  ];

  const searchRelated = async () => {
    try {
      const organizations = await organizationService.getOrganizations(
        { deleted: false, search: filter },
        { page: 1, limit: 15 }
      );
      const data = await organizationService.getRelations(organizationId);
      const DATA = organizations.data.organizations.filter((d) => {
        // return !data.some((c) => {
        //   return c.related_organization_id === d.id || d.id === organizationId;
        // });
        return filter.toLowerCase() === '' || filter.toLowerCase() === null
          ? d
          : d.name.toLowerCase().includes(filter.toLowerCase());
      });
      console.log('filter', filter);
      console.log('data', data);
      console.log('DATA', DATA);
      setData(DATA);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem(item.id);
  };
  const handleSelectRelation = (item) => {
    setSelectedRelation(item.name);
  };

  const handleSubmit = async () => {
    try {
      let type = selectedRelation.toLowerCase();
      let org_id = '';
      let parent_id = '';
      if (type === 'daughter') {
        parent_id = organizationId;
        org_id = selectedItem;
        type = 'parent';
      } else {
        org_id = organizationId;
        parent_id = selectedItem;
      }
      await organizationService.addRelation(org_id, parent_id, type);

      setShowAddRelatedModal(false);
      onHandleShowAlertSuccess(constants.messageSuccessSaveRelation);
    } catch (error) {
      onHandleShowAlertFailed(constants.messageFailedSaveRelation);
    }
  };

  const handleCloseAddRelatedModal = () => {
    setShowAddRelatedModal(false);
  };

  useEffect(() => {
    if (showAddRelatedModal) {
      searchRelated();
    } else {
      setSelectedItem(null);
      getRelated();
      setFilter('');
    }
  }, [showAddRelatedModal]);

  useEffect(() => {
    if (filter) {
      searchRelated();
    }
  }, [filter]);

  return (
    <>
      <SimpleModal
        onHandleCloseModal={handleCloseAddRelatedModal}
        open={showAddRelatedModal}
        modalTitle="Add Relation"
        buttonLabel={'Add Relation'}
        buttonsDisabled={!selectedItem}
        handleSubmit={handleSubmit}
      >
        <div className="pb-4 media">
          <div style={{ width: '70%' }}>
            <DropdownSearch
              title="Organization"
              search={filter}
              customTitle={'name'}
              onChange={(e) => {
                setFilter(e?.target?.value);
              }}
              data={data}
              onHandleSelect={(item) => {
                handleSelect(item);
              }}
            />
          </div>
          <div style={{ width: '30%' }}>
            <DropdownSearch
              title="Add Relation"
              search={filter}
              customTitle={'name'}
              onChange={(e) => {
                setFilter(e?.target?.value);
              }}
              data={relations}
              onHandleSelect={(item) => {
                handleSelectRelation(item);
              }}
              showAvatar={false}
              hideSearchBar={true}
            />
          </div>
        </div>
        {allRelatedOrgs?.map((item) => (
          <OrgRelatedList
            item={item}
            key={item.id}
            handleRemove={handleRemove.bind(null, item)}
            isPrincipalOwner={isPrincipalOwner}
            mainOwner={mainOwner}
          />
        ))}
      </SimpleModal>
      {children}
    </>
  );
};

export default AddRelated;
