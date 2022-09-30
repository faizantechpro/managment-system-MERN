import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Avatar from '../Avatar';
import { setDateFormat } from '../../utils/Utils';
import { CardButton } from '../layouts/CardLayout';
import feedService from '../../services/feed.service';
import stringConstants from '../../utils/stringConstants.json';
import MoreActions from '../MoreActions';
import ModalConfirm from '../modal/ModalConfirmDefault';
import MentionsInput from '../mentions/MentionsInput';
import routes from '../../utils/routes.json';

export const items = () => {
  return [
    {
      id: 'edit',
      icon: 'edit',
      name: 'Edit',
    },
    {
      id: 'remove',
      icon: 'delete',
      name: 'Delete',
      className: 'text-danger',
    },
  ];
};

const constants = stringConstants.feed.comments;
const defaultPagination = { page: 1, limit: 3 };
const Comments = ({ data, me }) => {
  const [feedComments, setFeedComments] = useState([]);
  const [pagination, setPagination] = useState(defaultPagination);
  const [commentEdit, setCommentEdit] = useState({ id: null });
  const [commentDelete, setCommentDelete] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const getComments = (forceFetch = false) => {
    if (!data.total_comments && forceFetch === false) {
      return;
    }
    setFeedComments([]);

    feedService
      .getComments(data.id, pagination)
      .then((res) => {
        setFeedComments(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addComment = async (raw) => {
    try {
      setIsLoading(true);
      await feedService.addComment(data.id, raw);

      getComments(true);
      closeAddComment();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAddComment = () => {
    setShowInput(false);
  };

  const openAddComment = () => {
    setShowInput(true);
  };

  const onHandleModeEdit = (item) => {
    setCommentEdit(item);
  };

  const onHandleCancelModeEdit = () => {
    setCommentEdit({ id: null });
  };

  const onHandleEditComment = async (raw) => {
    try {
      setIsLoadingEdit(true);
      await feedService.editComment(commentEdit.id, raw);
      getComments(true);
      setCommentEdit({ id: null });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const onHandleRemoveComment = () => {
    feedService
      .deleteComment(commentDelete.id)
      .then(() => {
        setCommentEdit({ id: null });
        getComments(true);
        setCommentDelete(null);
        setOpenModal(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const renderEditComments = () => {
    return (
      <div className="w-100">
        <MentionsInput
          type={`comment`}
          defaultState={commentEdit.message || commentEdit.comment}
          handleSubmit={onHandleEditComment}
          onHandleCancel={onHandleCancelModeEdit}
          isLoading={isLoadingEdit}
          submitLabel={`Update`}
        />
      </div>
    );
  };

  useEffect(() => {
    getComments();
  }, [pagination.limit]);

  return (
    <div>
      <ModalConfirm
        open={openModal}
        icon="warning"
        onHandleConfirm={onHandleRemoveComment}
        onHandleClose={() => {
          setOpenModal(false);
          setCommentDelete(null);
        }}
        textBody={constants.messageWarningModalDelete}
        labelButtonConfirm={'Yes, Delete'}
        iconButtonConfirm=""
        colorButtonConfirm={'outline-danger'}
      />
      <div className="pt-2 pr-2 pl-4 d-flex justify-content-between">
        <p className="cursor-pointer d-gray" onClick={openAddComment}>
          <span className="material-icons-outlined">chat</span>{' '}
          {constants.addCommentButton}
        </p>
        {pagination?.count > 0 && (
          <p className="text-normal-bold">
            {pagination?.count} {constants.commentsLabel}
          </p>
        )}
      </div>
      <div className="pl-4 comments-container">
        {showInput && (
          <>
            <MentionsInput
              handleSubmit={addComment}
              type={`comment`}
              isLoading={isLoading}
              submitLabel={`Comment`}
              onHandleCancel={closeAddComment}
            />

            <hr />
          </>
        )}

        {feedComments?.map((item) => {
          const isCommentOwner =
            me?.roleInfo?.admin_access ||
            me?.roleInfo?.owner_access ||
            item?.user_id === me?.id;

          return (
            <div key={item.id}>
              <div className="d-flex justify-content-start">
                <Avatar
                  user={item?.user}
                  classModifiers="size-avatar-comment"
                />
                <div className="ml-2 w-100">
                  <div className="mb-2">
                    <Link to={`${routes.usersProfile}/${item?.user?.id}`}>
                      <span className="text-normal-bold text-block">
                        {item?.user?.first_name} {item?.user?.last_name}
                      </span>
                    </Link>
                    <span className="ml-2">
                      {setDateFormat(item.updatedAt, 'MMM DD YYYY h:mm A')}
                    </span>
                    {item.updatedAt !== item.createdAt && !item.deleted && (
                      <span className="fs-italic"> • Edited</span>
                    )}
                  </div>
                  {item.id !== commentEdit.id ? (
                    <>
                      {!item.deleted ? (
                        <MentionsInput
                          readOnly
                          defaultState={item.message || item.comment}
                        />
                      ) : (
                        <span className="fs-italic text-danger">
                          {constants.messageDelete}
                        </span>
                      )}
                    </>
                  ) : (
                    renderEditComments()
                  )}
                </div>

                {!item.deleted && isCommentOwner && (
                  <div className="ml-auto">
                    <MoreActions
                      items={items()}
                      onHandleEdit={onHandleModeEdit.bind(null, item)}
                      onHandleRemove={() => {
                        setOpenModal(true);
                        setCommentDelete(item);
                      }}
                    />
                  </div>
                )}
              </div>
              <hr />
            </div>
          );
        })}
        {pagination?.count > feedComments.length &&
          pagination.page < pagination.totalPages && (
            <CardButton
              variant="white"
              title={constants.seeMoreComments}
              isLoading={isLoading}
              onClick={() => {
                setPagination((prev) => ({ ...prev, limit: prev.limit + 3 }));
              }}
              block
            />
          )}
      </div>
    </div>
  );
};

export default Comments;
