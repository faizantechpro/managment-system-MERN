import { Col, Row } from 'react-bootstrap';

import TextInput from './TextInput';
import DateInput from './DateInput';
import { formatNumber } from '../../utils/Utils';

const TextInputsTable = ({
  id,
  inputList,
  inputValues,
  isNumerated,
  inputValuesHandler,
  classNameRow,
}) =>
  inputList?.length > 0 &&
  inputList?.map((row, index) => {
    const rowId = `row_${index + 1}`;
    const rowIndex = index;

    return (
      <div key={`key_${rowId}_header`}>
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
          </Row>
        )}

        <Row
          key={`key_${rowId}`}
          id={rowId}
          className={`align-items-center ${classNameRow}`}
        >
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
                {cell.type === `date` && (
                  <DateInput
                    name={inputId}
                    id={inputId}
                    value={inputValues[inputId]}
                    onChange={inputValuesHandler}
                    placeholder={cell.placeholder}
                    className={`font-weight-500 mb-0`}
                    containerClassName={`m-1`}
                    formClassName={`m-0`}
                  />
                )}
                {cell.type === `amount` && (
                  <TextInput
                    id={inputId}
                    disabled
                    name={inputId}
                    placeholder={cell.placeholder}
                    value={formatNumber(
                      inputValues[`${rowId}_${`price`}`] *
                        inputValues[`${rowId}_${`quantity`}`],
                      2
                    )}
                    onChange={inputValuesHandler}
                    className={`font-weight-500 mb-0`}
                    containerClassName={`m-1`}
                    formClassName={`m-0`}
                  />
                )}
              </Col>
            );
          })}
        </Row>
      </div>
    );
  });

export default TextInputsTable;
