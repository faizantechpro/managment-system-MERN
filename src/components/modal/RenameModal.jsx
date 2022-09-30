import React from 'react';
import { Spinner } from 'react-bootstrap';

import {
  Modal,
  ModalBody,
  Row,
  Col,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';
import TextInput from '../inputs/TextInput';
import ButtonIcon from '../commons/ButtonIcon';

const RenameModal = ({
  open,
  onHandleConfirm,
  onHandleClose,
  setName,
  name,
  extension,
  loading,
}) => {
  return (
    <Modal
      isOpen={open}
      toggle={onHandleClose}
      fade={false}
      className="modal-small"
    >
      <ModalHeader toggle={onHandleClose} />
      <ModalBody>
        <Row className="text-center">
          <Col xs={12}>
            <span className="material-icons-outlined alert-icon-size">
              edit
            </span>
          </Col>
          <Col xs={12} className="mt-4">
            <p>{'Enter the new file name'}</p>
          </Col>
          <Col xs={12} className="mt-4 media">
            <TextInput
              type="text"
              value={name}
              name={name}
              placeholder={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="pl-1 pt-3">
              {'.'}
              {extension}
            </p>
          </Col>
          {loading && (
            <Col xs={12} className="mt-4">
              <Spinner animation="border" variant="primary" />
            </Col>
          )}
        </Row>
      </ModalBody>
      <ModalFooter className="flex-nowrap">
        <ButtonIcon
          onclick={onHandleConfirm}
          icon={'edit'}
          label={'Rename'}
          color={'outline-danger'}
          classnames="w-50 btn-sm"
          disabled={loading || name === ''}
        />
        <ButtonIcon
          onclick={onHandleClose}
          label="No, Cancel"
          color={'primary'}
          classnames="w-50 btn-sm"
          disabled={loading}
        />
      </ModalFooter>
    </Modal>
  );
};

export default RenameModal;
