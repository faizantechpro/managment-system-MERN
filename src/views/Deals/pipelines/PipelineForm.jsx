import moment from 'moment';
import { useEffect, useReducer, useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

import DropdownSearch from '../../../components/DropdownSearch';
import {
  ALL_LABEL,
  currencies,
  SAVE_LABEL,
  CANCEL_LABEL,
  PRIMARY_OWNER,
  EXPECTED_CLOSE_DATE,
  DEAL_TITLE,
} from '../../../utils/constants';
import { labels } from '../contacts/Contacts.constants';
import {
  onGetOwners,
  onHandleSelect,
  onInputChange,
  onInputSearch,
  reducer,
} from '../contacts/utils';
import { valueNumberValidator } from '../../../utils/Utils';
import ReactDatepicker from '../../../components/inputs/ReactDatpicker';

const maxPrice = 99999999.0;

const PipelineForm = ({ setEditMode, deal, onHandleSubmit }) => {
  const [data, setData] = useState([]);
  const [, setSelectStage] = useState(ALL_LABEL);
  const [selectOwner, setSelectOwner] = useState('');
  const [currency] = useState(currencies[0]);
  const [closingDate, setClosingDate] = useState('');

  const [filter, setFilter] = useState({
    search: '',
    users: [],
  });

  const [dealFormData, dispatch] = useReducer(reducer, {});

  useEffect(() => {
    document.querySelector('.prevent-scroll').addEventListener('wheel', (e) => {
      e.preventDefault();
    });
  }, []);

  useEffect(() => {
    if (deal) {
      dispatch({
        type: 'load',
        payload: deal,
      });

      getStage();
      getOwner();
    }
  }, [deal]);

  useEffect(() => {
    onGetOwners(filter, setData);
  }, [filter]);

  const getStage = () => {
    const stage = labels.find((label) => label.name === deal.deal_type);

    setSelectStage(stage?.title);
  };

  const getOwner = () => {
    setSelectOwner(
      `${deal.assigned_user.first_name} ${deal.assigned_user.last_name}`
    );
  };

  const onSubmit = async () => {
    const newDealFormData = {
      ...dealFormData,
      sales_stage: dealFormData.deal_type,
    };

    onHandleSubmit(newDealFormData);
  };

  const onChangeClosingDate = (selectedDate) => {
    setClosingDate(selectedDate);
    dispatch({
      type: 'set',
      input: 'date_closed',
      payload: moment(selectedDate).format('YYYY-MM-DD'),
    });
  };

  const amountHandler = (e) => {
    let { value } = e.target;

    value = valueNumberValidator(value, 2, maxPrice);

    e.target.value = value;
    onInputChange(e, dispatch);
  };

  return (
    <>
      <Form className="card-body bg-light">
        <FormGroup>
          <Label htmlFor="name">{DEAL_TITLE}</Label>
          <Input
            type="text"
            name="name"
            id="name"
            onChange={(e) => onInputChange(e, dispatch)}
            placeholder="Title"
            value={dealFormData.name || ''}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="amount">Value</Label>
          <div>
            <Input
              type="number"
              name="amount"
              id="amount"
              onChange={amountHandler}
              placeholder="Value"
              disabled
              className="mr-2 prevent-scroll"
              value={dealFormData.amount || ''}
            />

            <Input
              type="text"
              name="currency"
              id="currency"
              disabled
              onChange={amountHandler}
              placeholder={currency.title}
              className="mt-2"
              value={currency.title}
            />
          </div>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date_closed">{EXPECTED_CLOSE_DATE}</Label>
          <ReactDatepicker
            id="date_closed"
            name="date_closed"
            format="MM/dd/yyyy"
            minDate={new Date()}
            todayButton="Today"
            className="form-control mx-0 mb-0"
            placeholder="MM/DD/YYYY"
            value={closingDate}
            onChange={(date) => onChangeClosingDate(date)}
          />
        </FormGroup>

        <FormGroup>
          <Label>{PRIMARY_OWNER}</Label>
          <DropdownSearch
            id="assigned_user_id"
            title={'Search for owner'}
            selected={selectOwner}
            name="assigned_user_id"
            onChange={(e) => onInputSearch(e, filter, setFilter)}
            data={data}
            onHandleSelect={(item) =>
              onHandleSelect(item, 'assigned_user_id', dispatch, setSelectOwner)
            }
          />
        </FormGroup>

        <div className="text-right">
          <button
            className="btn btn-white mr-2"
            onClick={() => {
              setEditMode(false);
            }}
          >
            {CANCEL_LABEL}
          </button>
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            {SAVE_LABEL}
          </button>
        </div>
      </Form>
    </>
  );
};

export default PipelineForm;
