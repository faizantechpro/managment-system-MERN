import React from 'react';
import { Form } from 'react-bootstrap';

const ByChecks = ({
  data,
  setData,
  keyType = 'title',
  keyFilter = 'job_functions',
  itemsCheck,
}) => {
  const selected = data[keyType][keyFilter];

  const addItem = (value) => {
    const checks = selected.slice();
    checks.push(value);

    const newData = {
      ...data,
      [keyType]: {
        ...data[keyType],
        [keyFilter]: checks,
      },
    };

    setData(newData);
  };

  const removeItem = (value) => {
    const checks = selected.slice();
    const index = checks.findIndex((job) => job === value);
    checks.splice(index, 1);

    const newData = {
      ...data,
      [keyType]: {
        ...data[keyType],
        [keyFilter]: checks,
      },
    };

    setData(newData);
  };

  const onHandleChangeRadio = (name, checked) => {
    if (!checked) {
      return addItem(name);
    }

    removeItem(name);
  };

  return (
    <div className="w-100 p-2">
      {itemsCheck.map((item, index) => (
        <Form.Check key={index} name={item}>
          <Form.Check.Input
            className="cursor-pointer"
            onChange={() =>
              onHandleChangeRadio(
                item,
                selected.some((job) => job === item)
              )
            }
            id={`archived-${item}`}
            type="checkbox"
            checked={selected.some((job) => job === item)}
          />
          <Form.Check.Label
            htmlFor="archived"
            className="cursor-pointer fw-normal"
            onClick={() => {
              onHandleChangeRadio(
                item,
                selected.some((job) => job === item)
              );
            }}
          >
            {item}
          </Form.Check.Label>
        </Form.Check>
      ))}
    </div>
  );
};

export default ByChecks;
