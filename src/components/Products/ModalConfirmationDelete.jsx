import React from 'react';
import { Col, Modal, Row, Spinner } from 'react-bootstrap';

import ButtonIcon from '../commons/ButtonIcon';

const ModalConfirmationDeleteWithResult = ({
  show,
  onHandleClose,
  icon = 'report_problem',
  message = '',
  items = [],
  onHandleDelete,
  loading,
  done,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHandleClose}
      dialogClassName="modal-xs"
      animation={false}
      centered
    >
      <Modal.Body className="p-5">
        <Row noGutters className="w-100">
          <Col xs={12} className="text-center mb-4">
            <span className="material-icons-outlined alert-icon-size">
              {icon}
            </span>
          </Col>
          <Col xs={12} className="text-center">
            <p className="fs-18 m-0">{message}</p>
          </Col>
          <hr className="w-100 my-4" />
          {!loading && (
            <Col xs={12}>
              {!done && (
                <span className="fw-bold">You are about to delete:</span>
              )}
              <ul>
                {items.map(({ name, id, isDeleted }) => {
                  return (
                    <li key={id}>
                      {name} {done && (isDeleted ? '✅' : '❌')}
                    </li>
                  );
                })}
              </ul>
            </Col>
          )}
          {loading && (
            <Col xs={12} className="text-center">
              <Spinner animation="border" variant="primary" />
            </Col>
          )}

          <hr className="w-100" />

          <Col xs={12} className="d-flex justify-content-end">
            {!done && (
              <ButtonIcon
                color="outline-danger"
                icon="delete"
                label={'Yes, Delete'}
                onclick={onHandleDelete}
                classnames="w-50 btn-sm"
              />
            )}
            <ButtonIcon
              label={!done ? 'No, Cancel' : 'Ok, Close'}
              classnames={`ml-2 btn-sm ${!done ? ' w-50' : 'w-100'}`}
              onclick={onHandleClose}
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ModalConfirmationDeleteWithResult;
