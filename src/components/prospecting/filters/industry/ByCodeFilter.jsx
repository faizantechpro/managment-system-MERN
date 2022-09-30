import React from 'react';
import { Col, FormControl, InputGroup, Row } from 'react-bootstrap';

import stringConstants from '../../../../utils/stringConstants.json';

const constants = stringConstants.global.commons;

const ByCodeFilter = ({ data, setData, keyFilter, message }) => {
  const updateSICCode = (newCode = []) => {
    const newFilter = {
      ...data,
      industry: {
        ...data.industry,
        [keyFilter]: newCode,
      },
    };

    setData(newFilter);
  };

  const onHandleAddInputs = () => {
    if (data.industry[keyFilter].length < 6) {
      const inputs = data.industry[keyFilter].slice();
      inputs.push('', '');

      updateSICCode(inputs);
    }
  };

  const onHandleChange = (e) => {
    const { value, name } = e.target;
    const inputs = data.industry[keyFilter].slice();
    inputs[name] = value;

    updateSICCode(inputs);
  };

  const onHandleRemoveinput = (position) => {
    const inputs = data.industry[keyFilter].slice();
    inputs.splice(position, 1);

    updateSICCode(inputs);
  };

  return (
    <Row className="w-100 px-3">
      <Col sm={12}>
        <span className="fw-normal">{message}</span>
      </Col>
      {data.industry[keyFilter].map((val, index) => {
        return (
          <Col sm={6} key={index} className="mt-2">
            <InputGroup>
              <FormControl
                type="text"
                className="border-end-0"
                value={val}
                name={index}
                onChange={onHandleChange}
              />
              <InputGroup.Text
                onClick={() => onHandleRemoveinput(index)}
                className="border-start-0 px-2 cursor-pointer rounded-end"
              >
                &times;
              </InputGroup.Text>
            </InputGroup>
          </Col>
        );
      })}

      <span
        className="w-100 p-2 text-muted cursor-pointer fs-6"
        onClick={onHandleAddInputs}
      >
        + {constants.addMore}
      </span>
    </Row>
  );
};

export default ByCodeFilter;
