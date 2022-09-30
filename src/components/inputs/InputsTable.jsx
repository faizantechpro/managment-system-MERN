import { Col, Row, Dropdown } from 'react-bootstrap';

import Item from '../Item';
import List from '../List';
import TextInput from './TextInput';
import { CardButton } from '../layouts/CardLayout';
import { CardLabel } from '../layouts/ActivityLayout';
import { formatNumber } from '../../utils/Utils';

const InputsTable = ({
  id,
  inputList,
  inputValues,
  isNumerated,
  inputValuesHandler,
  classNameRow,
  products,
  productsDropdownHandler,
  deleteRow,
}) => {
  const handleCollapse = (id) => {
    const dropdownMenu = document.getElementById(id);
    dropdownMenu?.classList.remove('show');
  };

  return (
    inputList?.length > 0 &&
    inputList?.map((row, index) => {
      const rowId = `row_${index + 1}`;
      const rowIndex = index;

      return (
        <div key={`key_${rowId}`}>
          {rowIndex === 0 && (
            <Row
              id={`${rowId}_header`}
              className={`align-items-center modal-header-table ${
                classNameRow || ''
              }`}
            >
              {isNumerated && (
                <Col
                  className={`col-auto mt-3 p-0 font-weight-semi-bold text-medium`}
                >
                  <span className={`cell-numbers`}>{`#`}</span>
                </Col>
              )}
              {row.length > 0 &&
                row.map((cell) => {
                  const inputId = `header_${rowId}_${cell.name}`;

                  return (
                    <Col
                      key={`key_${inputId}`}
                      className={`text-center mt-3 mb-0 font-weight-semi-bold text-medium`}
                    >
                      {cell.label}
                    </Col>
                  );
                })}
              <Col className={`p-0 col-auto ml-3`}></Col>
            </Row>
          )}

          <Row id={rowId} className={`align-items-center ${classNameRow}`}>
            {isNumerated && (
              <Col className={`col-auto p-0`}>
                <span className={`cell-numbers`}>{index + 1}</span>
              </Col>
            )}
            {row.map((cell) => {
              const inputId = `${rowId}_${cell.name}`;
              return (
                <Col key={`key_${inputId}`} className={`p-0`}>
                  {!cell.type && (
                    <TextInput
                      id={inputId}
                      name={inputId}
                      placeholder={cell.placeholder}
                      value={inputValues[inputId]}
                      onChange={inputValuesHandler}
                      className={`font-weight-500 mb-0`}
                      containerClassName={`m-1`}
                      formClassName={`m-0`}
                    />
                  )}
                  {cell.type === `dropdown` && (
                    <CardLabel labelSize={`full`} formClassName={`m-2`}>
                      <Dropdown drop="down" className={``} onClick={() => {}}>
                        <Dropdown.Toggle
                          className="w-100 dropdown-input"
                          variant="outline-link"
                        >
                          <span>
                            {inputValues[inputId]?.name || 'Select a product'}
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="w-100" id={inputId}>
                          <Col xs={12} className="px-3">
                            {/* {error && error.error && (
                              <p className="alert-danger px-3 py-1 mb-1 rounded">
                                {error.msg}
                              </p>
                            )} */}
                            <List className={`dropdown-results`}>
                              {products?.map((item, index) => {
                                const id = `data_${index}_${item.code}`;
                                return (
                                  <div key={id}>
                                    <Item
                                      id={id}
                                      onClick={() => {
                                        productsDropdownHandler(
                                          inputId,
                                          item.id,
                                          item.name
                                        );
                                        handleCollapse(inputId);
                                      }}
                                    >
                                      {item.name}
                                    </Item>
                                  </div>
                                );
                              })}
                            </List>
                          </Col>
                        </Dropdown.Menu>
                      </Dropdown>
                    </CardLabel>
                  )}
                  {cell.type === `amount` && (
                    <TextInput
                      id={inputId}
                      disabled
                      name={inputId}
                      placeholder={cell.placeholder}
                      value={formatNumber(inputValues[inputId]) || ''}
                      onChange={inputValuesHandler}
                      className={`font-weight-500 mb-0`}
                      containerClassName={`m-1`}
                      formClassName={`m-0`}
                    />
                  )}
                </Col>
              );
            })}
            <Col className={`p-0 col-auto`}>
              <CardButton
                className={'font-weight-500 p-0'}
                icon={`close`}
                variant={``}
                onClick={() => {
                  deleteRow(rowId);
                }}
              />
            </Col>
          </Row>
        </div>
      );
    })
  );
};

export default InputsTable;
