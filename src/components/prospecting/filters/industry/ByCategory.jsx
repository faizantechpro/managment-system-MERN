import React, { useState } from 'react';
import { Form, Collapse } from 'react-bootstrap';

import { industryCategory } from '../../constants';

const CheckDefault = ({ title, subTitle, onClick, check }) => {
  return (
    <Form.Check>
      <Form.Check.Input
        className="cursor-pointer"
        type="checkbox"
        onChange={() => onClick(title, subTitle, check)}
        checked={check}
      />
      <Form.Check.Label htmlFor="archived" className="cursor-pointer fw-normal">
        {subTitle?.name || title}
      </Form.Check.Label>
    </Form.Check>
  );
};

const CheckNested = ({ title, subTitles, onClick, data }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-100">
      <div className="w-100 d-flex">
        <CheckDefault
          title={title}
          onClick={onClick}
          check={data?.length > 0}
        />
        <span
          className="material-icons-outlined ml-auto cursor-pointer"
          onClick={() => setShow((show) => !show)}
        >
          {!show ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
        </span>
      </div>
      <Collapse in={show}>
        <div className="w-100 ml-3 mb-2">
          {subTitles?.map((value) => (
            <CheckDefault
              key={value.id}
              title={title}
              subTitle={value}
              onClick={onClick}
              check={data?.some((category) => category === value.id)}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

const ByIndustryCategory = ({ data, setData }) => {
  const addItem = (index, id) => {
    const selected = data.industry.category[index];
    let checks = selected.slice();
    checks.push(id);

    if (!id) {
      checks = industryCategory[index].map(({ id }) => id);
    }

    const newData = {
      ...data,
      industry: {
        ...data.industry,
        category: {
          ...data.industry.category,
          [index]: checks,
        },
      },
    };

    setData(newData);
  };

  const removeItem = (index, id) => {
    let checks = [];

    if (id) {
      const selected = data.industry.category[index];
      checks = selected.slice();
      const position = checks.findIndex((item) => item === id);
      checks.splice(position, 1);
    }

    const newData = {
      ...data,
      industry: {
        ...data.industry,
        category: {
          ...data.industry.category,
          [index]: checks,
        },
      },
    };

    setData(newData);
  };

  const onHandleChangeCheck = (index, value, check) => {
    if (!check) {
      return addItem(index, value?.id || null);
    }

    removeItem(index, value, value?.id || null);
  };

  return (
    <div className="w-100 p-2 overflow-y-auto">
      {Object.entries(industryCategory).map(([index, subindex]) => (
        <CheckNested
          key={index}
          title={index}
          subTitles={subindex}
          onClick={onHandleChangeCheck}
          data={data.industry.category[index]}
        />
      ))}
    </div>
  );
};

export default ByIndustryCategory;
