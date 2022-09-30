import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import DropdownSelect from '../DropdownSelect';
import IdfFormInput from '../idfComponents/idfFormInput/IdfFormInput';
import { dataInit, iconByTypeField } from './constantsPeople';
import fieldService from '../../services/field.service';
import ModalConfirmDefault from '../modal/ModalConfirmDefault';
import AlertWrapper from '../Alert/AlertWrapper';
import Alert from '../Alert/Alert';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.deals.organizations.profile;

const ItemField = ({ item, index, onEdit, onRemove }) => {
  const {
    name,
    type: { field_type },
  } = item;

  return (
    <Draggable key={name} draggableId={`id-${name}`} index={index}>
      {(provided) => (
        <Card
          className="mt-2"
          position
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Card.Body className="py-2 d-flex">
            <div className="align-items-center">
              <span
                className="material-icons-outlined mr-3 fs-4 text-primary cursor-pointer"
                {...provided.dragHandleProps}
              >
                drag_indicator
              </span>
              <span className="material-icons-outlined fs-4 mr-2">
                {iconByTypeField(field_type).icon}
              </span>{' '}
              <span>{name}</span>
            </div>
            <div className="ml-auto text-primary">
              <span
                className="material-icons-outlined fs-5 cursor-pointer"
                onClick={() => onEdit(item, index)}
              >
                edit
              </span>
              <span
                className="material-icons-outlined fs-5 ml-2 cursor-pointer"
                onClick={() => onRemove(item, index)}
              >
                delete
              </span>
            </div>
          </Card.Body>
        </Card>
      )}
    </Draggable>
  );
};

const ListCustomFields = ({ data, onEdit, onRemove, onHandleDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onHandleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            variant="flush"
          >
            {data?.map((item, position) => {
              return (
                <ItemField
                  key={position}
                  item={item}
                  index={position}
                  onEdit={onEdit}
                  onRemove={onRemove}
                />
              );
            })}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const CustomFieldsForm = ({ state, dispatch, currentView }) => {
  const [data, setData] = useState(dataInit);
  const [showAdd, setShowAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [options, setOptions] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remove, setRemove] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [numUseField, setNumUseField] = useState(0);

  const onHandleChange = (e) => {
    const { value } = e.target;
    setData({ ...data, name: value });
  };

  const addItem = () => {
    const exist = state.findIndex(
      (item) => item.name.toLowerCase() === data.name.toLowerCase()
    );

    if (exist === -1) {
      dispatch({ type: 'save', payload: data });
      setData(dataInit);
    } else {
      setErrorMessage(constants.overview.messageFieldExistAlready);
    }
  };

  const editItem = () => {
    const { position } = data;
    const exist = state.findIndex(
      (item, index) =>
        index !== position &&
        item.name.toLowerCase() === data.name.toLowerCase()
    );

    if (exist === -1) {
      dispatch({ type: 'edit', payload: { data, index: position } });
      setData(dataInit);
      setEdit(false);
      setShowAdd(false);
    } else {
      setErrorMessage(constants.overview.messageFieldExistAlready);
    }
  };

  const removeField = () => {
    const {
      item: { id },
      position,
    } = remove;

    setLoading(true);
    fieldService
      .removeFieldByType(id, currentView)
      .then((data) => {
        setOpenModal(false);
        setLoading(false);

        if (data) {
          dispatch({ type: 'delete', payload: position });

          return setSuccessMessage(constants.overview.successRemoveCustomField);
        }

        setErrorMessage(constants.overview.failedRemoveCustomField);
      })
      .catch((e) => {
        setErrorMessage(constants.overview.failedRemoveCustomField);
      });
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onHandleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(state, result.source.index, result.destination.index);

    dispatch({ payload: items, type: 'create' });
  };

  const removeCustomField = (item, position) => {
    if (item.id) {
      getNumberUseField(item.id);
      setRemove({ item, position });
      setOpenModal(true);
    } else {
      dispatch({
        type: 'delete',
        payload: position,
      });
    }
  };

  const editCustomField = (item, position) => {
    setData({ ...item, position });
    setShowAdd(true);
    setEdit(true);
  };

  const getNumberUseField = (fieldId) => {
    fieldService
      .getFieldById(currentView, fieldId)
      .then(({ data }) => {
        if (currentView === 'organization') {
          setNumUseField(data?.total_organizations || 0);
        } else {
          setNumUseField(data?.total_contacts || 0);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await fieldService.getOptions();

        const fieldsOption = data?.map((item) => ({
          ...item,
          icon: iconByTypeField(item.field_type).icon,
        }));

        setOptions(fieldsOption);
      } catch (e) {
        console.log(e);
      }
    };

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
      <ModalConfirmDefault
        open={openModal}
        onHandleConfirm={removeField}
        onHandleClose={() => setOpenModal(false)}
        textBody={
          <span>
            <span className="d-block mb-2 text-start">
              Are you sure you want delete the custom field:{' '}
              <span className="text-danger fw-bold">{remove?.item?.name}</span>?
              You have{' '}
              <span className="text-danger fw-bold">{numUseField}</span>{' '}
              {currentView} using this field.
            </span>
            <span>
              <b>Note:</b> Keep in mind if you delete this field you will lose
              all related values.
            </span>
          </span>
        }
        iconButtonConfirm="people"
        loading={loading}
        labelButtonConfirm={constants.deleteButton}
        colorButtonConfirm={'outline-danger'}
      />
      <Card>
        <Card.Body>
          <ListCustomFields
            onEdit={editCustomField}
            onRemove={removeCustomField}
            onHandleDragEnd={onHandleDragEnd}
            data={state}
          />

          {showAdd && (
            <Card className="mt-3">
              <Card.Body>
                <Row>
                  <Col xs={12}>
                    <IdfFormInput
                      label="Field Name"
                      placeholder=""
                      name="name"
                      value={data}
                      onChange={onHandleChange}
                    />
                  </Col>
                  <Col xs={12}>
                    <Form>
                      <Form.Label>{constants.overview.fieldType}</Form.Label>
                      <DropdownSelect
                        data={options}
                        onHandleSelect={(item) =>
                          setData({ ...data, type: item })
                        }
                        select={data?.type?.name}
                        typeMenu="custom"
                        placeholder={constants.overview.fieldType}
                      />
                    </Form>
                  </Col>
                  <Col xs={12} className="mt-3">
                    <div className="w-100 d-flex justify-content-end">
                      <button
                        className="btn btn-sm btn-white"
                        onClick={() => {
                          setData(dataInit);
                          setShowAdd(false);
                          setEdit(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-sm btn-primary ml-2"
                        onClick={() => {
                          if (
                            data.name.trim() !== '' &&
                            Object.keys(data.type).length !== 0
                          ) {
                            edit ? editItem() : addItem();
                          } else {
                            setErrorMessage(
                              constants.overview.validateDataMessage
                            );
                          }
                        }}
                      >
                        {edit ? 'Edit' : 'Add'}
                      </button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
          <button
            className="btn btn-sm btn-primary w-100 mt-3"
            onClick={() => {
              setShowAdd(true);
            }}
          >
            <i className="material-icons-outlined">add_circle_outline</i>{' '}
            {constants.overview.labelAddNewCustomField}
          </button>
        </Card.Body>
      </Card>
    </>
  );
};

export default CustomFieldsForm;
