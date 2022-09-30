import React from 'react';
import { Modal } from 'react-bootstrap';
import ButtonIcon from '../commons/ButtonIcon';
import IdfFormInput from '../idfComponents/idfFormInput/IdfFormInput';
import IdfFormInputCurrency from '../idfComponents/idfFormInput/IdfFormInputCurrency';
import IdfTextArea from '../idfComponents/idfFormInput/IdfTextArea';

const ProductCreateModal = ({
  show,
  onHandleClose,
  product,
  setProduct,
  onHandleSubmit,
  onHandleUpdate,
}) => {
  const onHandleChange = (e) => {
    const { value, name } = e.target;
    setProduct({ ...product, [name]: value });
  };

  return (
    <Modal
      show={show}
      onHide={onHandleClose}
      dialogClassName="modal-xs"
      animation={false}
    >
      <Modal.Header className="fw-bold" closeButton>
        Add New Product
      </Modal.Header>
      <Modal.Body>
        <IdfFormInput
          onChange={onHandleChange}
          name="name"
          label="Product Name"
          value={product}
          type="text"
          placeholder="Product name"
        />

        <IdfTextArea
          onChange={onHandleChange}
          name="description"
          label="Description"
          value={product}
          type="text"
          placeholder="Description"
        />
        <IdfFormInput
          onChange={onHandleChange}
          name="code"
          label="Code"
          value={product}
          type="text"
          placeholder="Product code"
        />

        <IdfFormInputCurrency
          onChange={onHandleChange}
          name="price"
          label="Price"
          value={product}
          type="text"
          max={999999999}
          step={0.01}
          min={0}
          placeholder="Product price"
        />

        <div className="d-flex justify-content-end">
          <ButtonIcon label="Cancel" color="white" onclick={onHandleClose} />
          <ButtonIcon
            label={!product.id ? 'Save' : 'Update'}
            classnames="ml-2"
            onclick={!product.id ? onHandleSubmit : onHandleUpdate}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProductCreateModal;
