import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { find, toString } from 'lodash';

import organizationService from '../../services/organization.service';
import contactService from '../../services/contact.service';
import {
  ALL_LABEL,
  currencies,
  EXPECTED_CLOSE_DATE,
  PIPELINE,
  SEARCH_FOR_CONTACT,
  SEARCH_FOR_ORGANIZATION,
  DEAL_TITLE,
  OWNER,
} from '../../utils/constants';
import {
  onGetOwners,
  onHandleSelect,
  onInputChange,
  onInputSearch,
} from '../../views/Deals/contacts/utils';
import DropdownSearch from '../DropdownSearch';
import DropdownSelect from '../DropdownSelect';
import userService from '../../services/user.service';
import DealProductsTable from '../DealProductsTable';
import productService from '../../services/product.service';
import { valueNumberValidator } from '../../utils/Utils';
import IdfOwnersHeader from '../idfComponents/idfAdditionalOwners/IdfOwnersHeader';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatepicker from '../inputs/ReactDatpicker';
import stageService from '../../services/stage.service';

const maxPrice = 99999999.0;

const DealForm = ({
  dispatch,
  dealFormData,
  profileInfo,
  searchValue,
  toggleModalSize,
  initialDeals = {},
  selectedStage,
  ...props
}) => {
  const [data, setData] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [allContacts, setAllContact] = useState([]);
  const [selectTitle, setSelectTitle] = useState(ALL_LABEL);
  const [seletCurrency, setSelectCurrency] = useState(currencies[0].value);
  const [closingDate, setClosingDate] = useState(new Date());
  const [selectOrganization, setSelectOrganization] = useState('');
  const [selectOwner, setSelectOwner] = useState('');
  const [selectContactPerson, setSelectContactPerson] = useState('');
  const [products, setProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [productsTotalAmount, setProductsTotalAmount] = useState(0);
  const [addProductsClicked, setAddProductsClicked] = useState(false);

  const [searchOrg, setSearchOrg] = useState({
    search: '',
  });
  const [searchContact, setSearchContact] = useState({
    search: '',
  });

  const [pipelineStages, setPipelineStages] = useState([]);

  const getPipelineStages = async () => {
    const stages = await stageService.getStages();
    const newStages = stages.map((stage) => {
      const { deal_stage } = stage;
      return {
        id: stage.id,
        name: deal_stage.name,
        title: deal_stage.name,
        stagePosition: stage.position,
      };
    });
    setPipelineStages(newStages);
    if (!selectedStage) {
      setSelectedStageOrFirst(newStages[0]);
    }
  };

  const getProductsList = async () => {
    const resp = await productService
      .getProducts(null, { limit: 100 })
      .catch((err) => console.log(err));
    setProducts(resp?.data?.products);
  };

  async function onGetOrganzations() {
    const response = await organizationService
      .getOrganizations(searchOrg, { limit: 100 })
      .catch((err) => err);

    setAllOrganizations(response?.data?.organizations);
  }

  async function onGetContacts() {
    const response = await contactService
      .getContact(searchContact, { limit: 100 })
      .catch((err) => err);

    setAllContact(response?.data?.contacts);
  }

  function setSelectedStageOrFirst(firstStage) {
    let initialLabel = '';

    // setting pre-selected stage if the component gets it from some other component
    if (selectedStage && Object.hasOwn(selectedStage, 'title')) {
      initialLabel = {
        id: selectedStage.stageId,
        title: selectedStage.title,
      };
    } else {
      initialLabel = find(initialDeals) || firstStage;
    }

    setSelectTitle(initialLabel?.title || 'Select Pipeline Stage');

    dispatch({
      type: 'set',
      input: 'tenant_deal_stage_id',
      payload: initialLabel?.id,
    });
  }

  useEffect(async () => {
    getPipelineStages();
  }, []);

  useEffect(() => {
    setSelectedStageOrFirst();
    getProductsList();
    setDealProducts([
      {
        description: {},
        price: 0,
        quantity: 1,
      },
    ]);
  }, []);

  useEffect(() => {
    const newDealProducts = dealProducts?.map((product) => ({
      id: product.id,
      product_id: product.description.id,
      quantity: parseFloat(product.quantity),
      price: parseFloat(product.price),
    }));

    dispatch({
      type: 'set',
      input: 'products',
      payload: newDealProducts,
    });

    dispatch({
      type: 'set',
      input: 'amount',
      payload: toString(productsTotalAmount),
    });
  }, [productsTotalAmount]);

  useEffect(() => {
    const currencySelected = find(currencies, { id: dealFormData.currency });

    setSelectCurrency(currencySelected?.title);
  }, [dealFormData.currency]);

  useEffect(() => {
    onGetOwners(null, setData);
  }, []);

  useEffect(() => {
    onGetOrganzations();
  }, [searchOrg]);

  useEffect(() => {
    if (!profileInfo && !dealFormData.contact_organization_id) {
      return onGetContacts();
    }
    getOrganizationContacts();
  }, [searchContact, dealFormData.contact_organization_id]);

  useEffect(() => {
    if (dealFormData.contact_organization_id && profileInfo) {
      setSelectOrganization(profileInfo?.name);
    }
  }, []);

  useEffect(() => {
    if (dealFormData.contact_person_id && !profileInfo) {
      const contact = find(allContacts, { id: dealFormData.contact_person_id });

      dispatch({
        type: 'set',
        input: 'contact_organization_id',
        payload: contact?.organization_id,
      });

      setSelectOrganization(contact?.organization?.name);
    }
  }, [dealFormData.contact_person_id]);

  useEffect(async () => {
    const me = await getCurrentUser().catch((err) => console.log(err));

    dispatch({
      type: 'set',
      input: 'assigned_user_id',
      payload: me?.id,
    });

    setSelectOwner(me);

    document
      .querySelector('.prevent-scroll')
      ?.addEventListener('wheel', (e) => {
        e.preventDefault();
      });
  }, []);

  useEffect(async () => {
    const ownerSelected = find(data, { id: dealFormData.assigned_user_id });

    if (ownerSelected) {
      setSelectOwner(ownerSelected);
    }
  }, [dealFormData.owner]);

  useEffect(() => {
    if (dealFormData.contact_person_id && !profileInfo) {
      getOrganizationContacts();
    }
  }, [dealFormData.contact_organization_id]);

  useEffect(() => {
    dispatch({
      type: 'set',
      input: 'lead_source',
      payload: PIPELINE.toLowerCase(),
    });
    dispatch({
      type: 'set',
      input: 'date_closed',
      payload: new Date().toISOString().split('T')[0],
    });
  }, []);

  const getOrganizationContacts = async () => {
    const organizationContacts = await contactService
      .getContactsByorganizationId(
        {
          organizationId: dealFormData.contact_organization_id,
          ...searchContact,
        },
        {
          page: 1,
          limit: 100,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    const { contacts } = organizationContacts || {};

    setAllContact(contacts || []);
  };

  const getCurrentUser = async () => {
    const user = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    return user;
  };

  const amountHandler = (e) => {
    let value = e.target.value <= 0 ? 0 : e.target.value;

    value = valueNumberValidator(value, 2, maxPrice);

    e.target.value = value;
    onInputChange(e, dispatch);
  };

  const onChangeClosingDate = (date) => {
    setClosingDate(date);
    dispatch({
      type: 'set',
      input: 'date_closed',
      payload: new Date(date).toISOString().split('T')[0],
    });
  };

  const toggleAddProducts = (e) => {
    e.preventDefault();
    if (addProductsClicked) {
      setProductsTotalAmount(0);
      setDealProducts([
        {
          description: {},
          price: 0,
          quantity: 1,
        },
      ]);
    }
    setAddProductsClicked(!addProductsClicked);
    toggleModalSize(!addProductsClicked);
  };

  const handlePipelineStageSelect = (item) => {
    onHandleSelect(item, 'tenant_deal_stage_id', dispatch, setSelectTitle);
  };

  return (
    <Form className="container">
      <Row>
        <Col xs={addProductsClicked ? 4 : 12}>
          <FormGroup className="mb-2 mt-4">
            <Label htmlFor="contact_organization_id">Organization</Label>
            <DropdownSearch
              id="contact_organization_id"
              title={SEARCH_FOR_ORGANIZATION}
              name="contact_organization_id"
              onChange={(e) => onInputSearch(e, searchOrg, setSearchOrg)}
              data={allOrganizations}
              disabled={Boolean(profileInfo)}
              onHandleSelect={(item) => {
                onHandleSelect(
                  item,
                  'contact_organization_id',
                  dispatch,
                  setSelectTitle
                );

                dispatch({
                  type: 'set',
                  input: 'contact_organization_new',
                  payload: null,
                });
              }}
              customTitle="name"
              selected={selectOrganization}
              search={searchOrg.search}
              createItem={(data) => {
                dispatch({
                  type: 'set',
                  input: 'contact_organization_new',
                  payload: data,
                });
              }}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <Label htmlFor="contact_person_id">Contact Person</Label>
            <DropdownSearch
              id="contact_person_id"
              title={SEARCH_FOR_CONTACT}
              name="contact_person_id"
              onChange={(e) =>
                onInputSearch(e, searchContact, setSearchContact)
              }
              data={allContacts}
              onHandleSelect={(item) => {
                onHandleSelect(
                  item,
                  'contact_person_id',
                  dispatch,
                  setSelectContactPerson
                );

                dispatch({
                  type: 'set',
                  input: 'contact_person_new',
                  payload: null,
                });
              }}
              selected={selectContactPerson}
              search={searchContact.search}
              createItem={(data) => {
                dispatch({
                  type: 'set',
                  input: 'contact_person_new',
                  payload: data,
                });
              }}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <Label htmlFor="name">{DEAL_TITLE}</Label>
            <Input
              type="text"
              name="name"
              id="name"
              value={searchValue}
              onChange={(e) => onInputChange(e, dispatch)}
              placeholder={DEAL_TITLE}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <Label htmlFor="amount">Value</Label>
            <div className="d-flex">
              <Input
                type="number"
                name="amount"
                id="amount"
                disabled={addProductsClicked === true}
                onChange={amountHandler}
                placeholder="0"
                className="w-60 mr-2 prevent-scroll"
                value={dealFormData.amount === '0' ? '' : dealFormData.amount}
              />
              <Input
                type="text"
                name="currency"
                id="currency"
                disabled
                onChange={amountHandler}
                placeholder={currencies[0].title}
                className="w-40"
                value={seletCurrency}
              />
            </div>
            <div className="py-2 text-right">
              <a
                href=""
                className="btn-link font-weight-normal"
                onClick={(e) => toggleAddProducts(e)}
              >
                {!addProductsClicked ? 'Add products' : "Don't add products"}
              </a>
            </div>
          </FormGroup>

          <FormGroup className="mb-2">
            <Label htmlFor="title">Pipeline Stage</Label>
            <DropdownSelect
              data={pipelineStages}
              customTitle="title"
              allOption={false}
              onHandleSelect={(item) => handlePipelineStageSelect(item)}
              select={selectTitle}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <Label>Pipeline</Label>
            <Input
              type="text"
              name="pipeline"
              id="pipeline"
              disabled
              placeholder="Value"
              className="form-control"
              value={`Pipeline`}
            />
          </FormGroup>

          <FormGroup className="mb-2">
            <Label htmlFor="date_closed">{EXPECTED_CLOSE_DATE}</Label>
            <ReactDatepicker
              id="date_closed"
              name="date_closed"
              format="MM/dd/yyyy"
              minDate={new Date()}
              todayButton="Today"
              value={closingDate}
              className="form-control mx-0 mb-0"
              placeholder="MM/DD/YYYY"
              onChange={(date) => onChangeClosingDate(date)}
            />
          </FormGroup>

          <FormGroup className="mb-2 mx-2 mb-4">
            <Label>{OWNER}</Label>
            <IdfOwnersHeader
              id="assigned_user_id"
              name="assigned_user_id"
              showAvatar={true}
              isClickable={false}
              mainOwner={selectOwner}
              allowDelete
              {...props}
            />
          </FormGroup>
        </Col>
        {addProductsClicked && (
          <Col xs={8} className="border-md-left px-0">
            <h4 className="m-3">Products</h4>
            <div className="borderline-top">
              <DealProductsTable
                dealProducts={dealProducts}
                setDealProducts={setDealProducts}
                totalAmount={productsTotalAmount}
                setTotalAmount={setProductsTotalAmount}
                products={products}
                dispatch={dispatch}
              />
            </div>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default DealForm;
