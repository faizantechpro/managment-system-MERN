import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Row, Col, Container } from 'react-bootstrap';
import { Element, scroller } from 'react-scroll';

import Alert from './Alert/Alert';
import { CardButton } from './layouts/CardLayout';
import { formatNumber, valueNumberValidator } from '../utils/Utils';
import TextInput from './inputs/TextInput';
import { CardLabel } from './layouts/ActivityLayout';
import dealsProductsConstants from '../utils/constants/dealsProducts.json';
import { onInputSearch } from '../views/Deals/contacts/utils';
import DropdownSearch from './DropdownSearch';
import productService from '../services/product.service';

const constants = dealsProductsConstants.strings;

const DealProductsTable = ({
  toast,
  setToast,
  dealProducts,
  setDealProducts,
  productToEdit,
  totalAmount,
  products,
  setTotalAmount,
  onHandleRemove,
}) => {
  const addNewRow = () => {
    const newDealProduct = {
      id: uuidv4(),
      description: {},
      price: 0,
      quantity: 1,
    };
    setDealProducts((dealProducts) => [...dealProducts, newDealProduct]);
    setSearchProduct({ search: '' });
    setFilterDealProducts([]);
    scroller.scrollTo('endContainer', {
      duration: 700,
      delay: 10,
      smooth: true,
      containerId: 'add_row',
    });
  };
  const [filterDealProducts, setFilterDealProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchProduct, setSearchProduct] = useState({
    search: '',
  });

  const getProductsList = async (value) => {
    if (value) {
      setLoading(true);
      const resp = await productService
        .getProducts({ search: value }, { limit: 100 })
        .catch((err) => console.log(err));
      setLoading(false);
      setFilterDealProducts(resp?.data?.products);
    }
  };

  useEffect(() => {
    getProductsList(searchProduct.search);
  }, [searchProduct]);

  const maxPrice = 99999999.0;
  const minQuantity = 1;
  const maxQuantity = 9999;

  const deleteRow = (id) => {
    setDealProducts(dealProducts.filter((i) => i.id !== id));
  };

  const handleUpdateDealProduct = (id, updatedDealProducts) => {
    const updatedObject = dealProducts.map((dealProduct) =>
      dealProduct.id === id ? updatedDealProducts : dealProduct
    );
    setDealProducts(updatedObject);
  };

  const handleChangeDealProduct = (value, name, dealProduct) => {
    if (name === 'price') {
      value = valueNumberValidator(value, 2, maxPrice);
    } else if (name === 'quantity') {
      value = valueNumberValidator(value, 0, maxQuantity, minQuantity);
    }

    if (name === 'description') {
      dealProduct.price = value.price;
    }

    dealProduct[name] = value;

    handleUpdateDealProduct(dealProduct.id, dealProduct);
  };

  const handleCollapse = (id) => {
    const dropdownMenu = document.getElementById(id);
    dropdownMenu?.classList.remove('show');
  };

  useEffect(() => {
    let totalAmountAcum = 0;
    dealProducts.forEach((dealProduct) => {
      const price = dealProduct.price;
      const quantity = dealProduct.quantity;
      const amount = price * quantity;
      totalAmountAcum = amount + totalAmountAcum || 0;
    });
    setTotalAmount(totalAmountAcum);
  }, [dealProducts]);

  const ProductsTableHeader = () => {
    const HeaderItem = ({ value, className, additionalClassName, xs }) => (
      <Col
        xs={xs}
        className={
          className ||
          `px-2 mt-3 mb-0 font-weight-semi-bold text-medium fs-7 ${
            additionalClassName || ''
          }`
        }
      >
        {value || '\u00A0'}
      </Col>
    );

    return (
      <Row noGutters className={`align-items-center modal-header-table`}>
        <HeaderItem
          xs={5}
          value="Item"
          additionalClassName="deals-product-name-dropdown"
        />
        <HeaderItem xs={2} value="Price" />
        <HeaderItem xs={2} value="Quantity" />
        <HeaderItem xs={2} value="Amount" />
        <HeaderItem
          xs={1}
          className="px-0 col-auto deals-product-delete-column"
        />
      </Row>
    );
  };

  const handleChangeProduct = (product, dealProduct) => {
    const { name, id, price } = product;
    handleChangeDealProduct(
      {
        name,
        id,
        price,
      },
      'description',
      dealProduct
    );
    handleCollapse(`${dealProduct.id}_description`);
  };

  return (
    <>
      <Container fluid className={`px-4`}>
        <Alert message={toast} setMessage={setToast} color="danger" />
      </Container>
      <Container id={`add_row`} fluid className={`px-1`}>
        <ProductsTableHeader />
        {dealProducts.map((dealProduct, index) => (
          <Row
            noGutters
            key={dealProduct.id}
            className={`align-items-center product-item-modal ${
              productToEdit === dealProduct.id ? ' active' : ''
            }`}
          >
            <Col xs={5} className={`p-0 deals-product-name-dropdown`}>
              <CardLabel
                labelSize={`full`}
                formClassName={`m-2`}
                containerClassName="pl-0"
              >
                <DropdownSearch
                  id="deal_product_search"
                  title="Search Products"
                  name="deal_product_search"
                  customTitle={'name'}
                  showAvatar={false}
                  loading={loading}
                  onChange={(e) =>
                    onInputSearch(e, searchProduct, setSearchProduct)
                  }
                  data={filterDealProducts}
                  onHandleSelect={(item) => {
                    handleChangeProduct(item, dealProduct);
                  }}
                  selected={dealProduct.description || {}}
                  search={searchProduct.search}
                />
              </CardLabel>
            </Col>
            <Col xs={2} className={`p-0`}>
              <TextInput
                id={`${dealProduct.id}_price`}
                name={`${dealProduct.id}_price`}
                placeholder={`Price`}
                value={dealProduct.price}
                onChange={(e) => {
                  handleChangeDealProduct(e.target.value, 'price', dealProduct);
                }}
                className={`font-weight-500 mb-0`}
                containerClassName={`m-1`}
                formClassName={`m-0`}
                inputClassName={'px-2'}
              />
            </Col>
            <Col xs={2} className={`p-0`}>
              <TextInput
                id={`${dealProduct.id}_quantity`}
                name={`${dealProduct.id}_quantity`}
                placeholder={`quantity`}
                value={dealProduct.quantity}
                onChange={(e) => {
                  handleChangeDealProduct(
                    e.target.value,
                    'quantity',
                    dealProduct
                  );
                }}
                className={`font-weight-500 mb-0`}
                containerClassName={`m-1`}
                formClassName={`m-0`}
                inputClassName={'px-2'}
              />
            </Col>
            <Col xs={2} className={`p-0`}>
              <TextInput
                id={`${dealProduct.id}_amount`}
                name={`${dealProduct.id}_amount`}
                placeholder={`amount`}
                disabled
                value={
                  dealProduct.quantity &&
                  dealProduct.price &&
                  (dealProduct.quantity > 0 && dealProduct.price > 0
                    ? formatNumber(
                        dealProduct.quantity * dealProduct.price,
                        2,
                        2
                      )
                    : `$0.00`)
                }
                className={`font-weight-500 mb-0`}
                containerClassName={`m-1`}
                formClassName={`m-0`}
                inputClassName={'px-1'}
              />
            </Col>
            <Col
              xs={1}
              className={`p-0 col-auto deals-product-close text-center`}
            >
              <CardButton
                className={'font-weight-500 p-0 text-danger'}
                icon={`close`}
                variant={``}
                onClick={() => {
                  onHandleRemove && onHandleRemove(dealProduct.id, false);
                  deleteRow(dealProduct.id);
                }}
              />
            </Col>
          </Row>
        ))}
        <Element name="endContainer" />
      </Container>
      <Row noGutters>
        <Col className={`text-left`}>
          <CardButton
            id={`add_row_btn`}
            className={'font-weight-500 fs-7 py-0 text-primary'}
            icon={'add'}
            title={constants.addRowButton.title}
            variant={``}
            onClick={() => addNewRow()}
          />
        </Col>
      </Row>
      <Row noGutters className={`align-items-center mt-2`}>
        <Col xs={7} className={`px-1 text-right font-weight-semi-bold`}>
          Total
        </Col>
        <Col />
        <Col xs={3} className={`px-1 text-right font-weight-semi-bold`}>
          {(totalAmount !== '00' && formatNumber(totalAmount, 2, 2)) || `$0.00`}
        </Col>
        <Col />
      </Row>
    </>
  );
};

export default DealProductsTable;
