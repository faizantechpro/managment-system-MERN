import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

import Pagination from '../Pagination';
import feedService from '../../services/feed.service';
import ActivityFile from '../peopleProfile/contentFeed/ActivityFile';
import dealService from '../../services/deal.service';
import contactService from '../../services/contact.service';
import organizationService from '../../services/organization.service';
import DropdownSearch from '../DropdownSearch';

const ActivityFilesModal = ({
  showModal,
  setShowModal,
  contactId,
  organizationId,
  setRefreshRecentFiles,
  refreshRecentFiles,
  publicPage,
  isOwner,
}) => {
  const ALLFiles = { id: 0, name: 'All Files', type: 'all' };
  const [pagination, setPagination] = useState({ page: 1, limit: 5 });
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [uploaders, setUploaders] = useState([ALLFiles]);
  const [filter, setFilter] = useState('');

  const getFiles = async () => {
    const result = await feedService.getFiles(
      { contactId, organizationId },
      pagination
    );

    setFiles(result.files);
    setFilteredFiles(result?.files);
    setPagination(result.pagination);
  };

  const getUsers = async () => {
    const uploadedBy = [
      ...new Set(
        files?.map((file) => {
          return {
            dealId: file.deal_id,
            contactId: file.contact_id,
            organizationId: file.organization_id,
          };
        })
      ),
    ];
    const Uploaders = await Promise.all(
      uploadedBy?.map(async (file) => {
        const fileUpload = !file.dealId
          ? !file.contactId
            ? {
                id: file.organizationId,
                name: (
                  await organizationService.getOrganizationById(
                    file.organizationId
                  )
                )?.name,
                type: 'organization',
              }
            : {
                id: file.contactId,
                name: (await contactService.getContactById(file.contactId))
                  ?.first_name,
                type: 'contact',
              }
          : {
              id: file.dealId,
              name: (await dealService.getDealById(file.dealId))?.name,
              type: 'deal',
            };
        return fileUpload;
      })
    );
    const uniqueUploaders = Array.from(
      new Set(Uploaders.map(JSON.stringify))
    ).map(JSON.parse);
    const nonDeletedUploaders = uniqueUploaders.filter((unique) => {
      return unique.name;
    });
    setUploaders([ALLFiles, ...nonDeletedUploaders]);
  };

  const ApplyFilter = (filterId, type) => {
    if (filterId === 0) {
      setFilteredFiles(files);
      return;
    }
    const newFiles = files?.filter((file) => {
      return type === 'deal'
        ? file.deal_id === filterId
        : type === 'contact'
        ? !file.deal_id && file.contact_id === filterId
        : !file.deal_id &&
          !file.contact_id &&
          file.organization_id === filterId;
    });
    setFilteredFiles(newFiles);
  };

  const changePage = (newPage) => {
    getUsers();
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    if (showModal || refreshRecentFiles) {
      getFiles();
      getUsers();
    }
  }, [pagination.page, showModal, refreshRecentFiles]);

  useEffect(() => {
    getUsers();
  }, [files]);

  const closeBtn = (
    <button
      className="close"
      style={{ fontSize: '30px' }}
      onClick={() => {
        setShowModal(false);
      }}
    >
      &times;
    </button>
  );

  return (
    <Modal isOpen={showModal} fade={false}>
      <ModalHeader tag="h3" close={closeBtn}>
        All files
      </ModalHeader>
      <ModalBody>
        <div className="mt-1 border-bottom media">
          <h5 className="ml-3 mb-3 mt-2">{`${
            filteredFiles?.length || 0
          } files uploaded`}</h5>
          <div style={{ width: '35%' }} className="ml-auto mr-3 mb-1">
            <DropdownSearch
              title="All Files"
              search={filter}
              customTitle={'name'}
              onChange={(e) => {
                setFilter(e?.target?.value);
              }}
              data={uploaders}
              onHandleSelect={(item) => {
                ApplyFilter(item.id, item.type);
              }}
              showAvatar={false}
            />
          </div>
        </div>
        {filteredFiles &&
          filteredFiles.map((file) => (
            <ActivityFile
              key={file.file_id}
              file={file}
              isModal
              getFiles={getFiles}
              setRefreshRecentFiles={setRefreshRecentFiles}
              publicPage={publicPage}
              isOwner={isOwner(file)}
            />
          ))}
        <div className="mt-2">
          <Pagination paginationInfo={pagination} onPageChange={changePage} />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ActivityFilesModal;
