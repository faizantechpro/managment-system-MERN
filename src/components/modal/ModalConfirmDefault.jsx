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
import { ACCEPT } from '../../utils/constants';
import ButtonIcon from '../commons/ButtonIcon';

const ModalConfirmDefault = ({
  open,
  onHandleConfirm,
  onHandleClose,
  textBody = '',
  labelButtonConfirm = ACCEPT,
  iconButtonConfirm = 'people',
  colorButtonConfirm = 'outline-danger',
  icon = 'info',
  colorButtonCancel = 'primary',
  loading,
  disabled,
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
              {icon}
            </span>
          </Col>
          <Col xs={12} className="mt-4">
            <p>{textBody}</p>
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
          icon={iconButtonConfirm}
          label={labelButtonConfirm}
          color={colorButtonConfirm}
          classnames="w-50 btn-sm"
          disabled={loading || disabled}
        />
        <ButtonIcon
          onclick={onHandleClose}
          label="No, Cancel"
          color={colorButtonCancel}
          classnames="w-50 btn-sm"
          disabled={loading}
        />
      </ModalFooter>
    </Modal>
  );
};

export default ModalConfirmDefault;
