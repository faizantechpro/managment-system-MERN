import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Spinner,
  // Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import roleService from '../../services/role.service';
import {
  CREATE_LABEL,
  initialCreateRoleState,
  CANCEL_LABEL,
  ROLE_CREATED,
  ERROR_ROLE_EXIST,
  ERROR_ROLE_REQUIRED,
  ADD_NEW_ROLE_LABEL,
} from '../../utils/constants';
import stringConstants from '../../utils/stringConstants.json';
import routes from '../../utils/routes.json';
import Alert from '../Alert/Alert';
import AlertWrapper from '../Alert/AlertWrapper';

const constants = stringConstants.settings.roles.add;

const CreateRoleModal = ({ showModal, setShowModal }) => {
  const [modified, setModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [createRoleData, setCreateRoleData] = useState(initialCreateRoleState);
  const [createBtnDisabled, setCreateBtnDisabled] = useState(true);

  const history = useHistory();

  // Handler of Modal close
  const onHandleCloseModal = () => {
    setModified(false);
    setErrorMessage(null);
    setSuccessMessage(null);
    setCreateRoleData(initialCreateRoleState);
    setShowModal(false);
  };

  // Create role service
  const createNewRole = async () => {
    setSuccessMessage(null);
    roleService
      .CreateRole(createRoleData)
      .then((response) => {
        setSuccessMessage(ROLE_CREATED);
        setTimeout(() => {
          history.push(`${routes.roles}/${response.id}`);
        }, 2500);
      })
      .catch(() => {
        setErrorMessage(ERROR_ROLE_EXIST);
      });
  };

  // Form basic validations
  useEffect(() => {
    if (createRoleData.name === '') {
      setCreateBtnDisabled(true);
    } else {
      setErrorMessage(null);
      setCreateBtnDisabled(false);
    }
    modified &&
      createRoleData.name === '' &&
      setErrorMessage(ERROR_ROLE_REQUIRED);
  }, [createRoleData]);

  // Capture form input changes
  const onInputChange = (e) => {
    const { name, value } = e.target || {};
    setCreateRoleData({
      ...createRoleData,
      [name]: value,
    });
    setModified(true);
  };

  // Handler of submit
  const handleSubmit = async () => {
    setIsLoading(true);
    await createNewRole();
    setIsLoading(false);
    setIsRedirecting(true);
  };

  // Modal close jsx
  const closeBtn = (
    <button className="close" onClick={onHandleCloseModal}>
      &times;
    </button>
  );

  return (
    <Modal isOpen={showModal} fade={false}>
      <ModalHeader tag="h2" close={closeBtn}>
        {ADD_NEW_ROLE_LABEL}
      </ModalHeader>
      <ModalBody>
        <AlertWrapper>
          <Alert
            color="danger"
            message={errorMessage}
            setMessage={setErrorMessage}
          />
          <Alert
            color="success"
            message={successMessage}
            setMessage={setSuccessMessage}
          />
        </AlertWrapper>
        <Form>
          <FormGroup>
            <Label htmlFor="name">{constants.name}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={createRoleData.name}
              placeholder={constants.name}
              onChange={onInputChange}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="description">{constants.description}</Label>
            <Input
              type="text"
              name="description"
              id="description"
              value={createRoleData.description}
              placeholder={constants.description}
              onChange={onInputChange}
            ></Input>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        {isLoading && (
          <button
            className="btn btn-white"
            data-dismiss="modal"
            data-uw-styling-context="true"
            onClick={onHandleCloseModal}
          >
            {CANCEL_LABEL}
          </button>
        )}
        {isRedirecting ? (
          <>
            <Spinner className={`text-primary`} />
            <span className={`text-primary`}>{constants.redirecting}</span>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            data-uw-styling-context="true"
            onClick={handleSubmit}
            disabled={createBtnDisabled}
          >
            {isLoading ? <Spinner /> : <span>{CREATE_LABEL}</span>}
          </button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default CreateRoleModal;
