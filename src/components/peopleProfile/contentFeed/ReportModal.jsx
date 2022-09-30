import React, { useState, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import {
  ListGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import dataReportConstants from '../../../utils/constants/dataReport.json';
import ReportToolbar from './ReportToolbar';
import TextInputsTable from '../../inputs/TextInputsTable';
import TextInput from '../../inputs/TextInput';
import { CardButton } from '../../layouts/CardLayout';
import {
  defaultReportBlocks,
  DynamicBlock,
} from '../../reportbuilder/constants/reportBuilderConstants';
import BlockItem from '../../reportbuilder/blocks/BlockItem';
import { scrollToBottomContainer } from '../../../utils/Utils';

const constants = dataReportConstants.strings;
const toolbarItems = dataReportConstants.tabs.toolbarModal;
const mainInputs = dataReportConstants.inputs.treasury.main;
const rowsToDrawNum = 4;

const ReportModal = ({
  showModal,
  setShowModal,
  generateReport,
  generateReportToUpdate,
  setGenerating,
  editMode,
  report,
  setToast,
  setColorToast,
  blocks,
  setBlocks,
}) => {
  const [reportTab, setReportTab] = useState('treasury');
  const [treasuryInputs, setTreasuryInputs] = useState([]);
  const [treasuryMainInputs, setTreasuryMainInputs] = useState([mainInputs]);
  const [treasuryMainInputsValues, setTreasuryMainInputsValues] = useState([]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const validateReport = () => {
    if (!treasuryMainInputsValues.row_1_date) {
      throw new Error(constants.errors.dateReport);
    } else if (
      !treasuryMainInputsValues.row_1_existing_avr_balance ||
      treasuryMainInputsValues.row_1_existing_avr_balance <= 0
    ) {
      throw new Error(constants.errors.existingAverage);
    }
  };

  const handleShowResults = () => {
    try {
      validateReport();
      generateReport({ treasuryMainInputsValues, treasuryInputs });
      setGenerating(true);
      handleCloseModal();
    } catch (error) {
      setToast(error.message);
      setColorToast(constants.colors.danger);
    }
  };

  const handleUpdate = () => {
    const reportId = report.id;
    generateReportToUpdate({
      treasuryMainInputsValues,
      treasuryInputs,
      reportId,
    });
    setGenerating(true);
    handleCloseModal();
  };

  const closeBtn = (
    <button className={`close`} onClick={handleCloseModal}>
      &times;
    </button>
  );

  const handleMainTreasuryValues = (name, value) => {
    const newTextInputValues = {
      ...treasuryMainInputsValues,
      [name]: value,
    };
    setTreasuryMainInputsValues(newTextInputValues);
  };

  const handleChangeTreasuryInput = (value, name, treasuryRowToUpdate) => {
    treasuryRowToUpdate[name].value = value;
    const updatedRows = treasuryInputs.map((inputsRow) =>
      inputsRow.id === treasuryRowToUpdate.id ? treasuryRowToUpdate : inputsRow
    );
    setTreasuryInputs(updatedRows);
  };

  const newTreasuryInputsRow = {
    id: uuidv4(),
    description: { placeholder: 'Description', value: '' },
    totalMonthlyItems: { placeholder: 'Total Monthly Items', value: 1 },
    existingFee: { placeholder: 'Existing', value: '0.0' },
    proposedFee: { placeholder: 'Proposed', value: '0.0' },
  };

  const addNewRow = (row) => {
    treasuryInputs.length < 6 &&
      setTreasuryInputs((treasuryInputs) => [...treasuryInputs, row]);
  };

  const deleteRow = (id) => {
    setTreasuryInputs(treasuryInputs.filter((i) => i.id !== id));
  };

  const setDefaultDescription = (value) => {
    switch (value) {
      case 1:
        return `ACH`;
      case 2:
        return `Wires`;
      case 3:
        return `Credit Card`;
      case 4:
        return `Transfers`;
      default:
        return ``;
    }
  };

  const drawDefaultRows = (rowsToDraw) => {
    for (let actualRow = 1; actualRow <= rowsToDraw; actualRow++) {
      const defaultRow = {
        id: uuidv4(),
        description: {
          placeholder: 'Description',
          value: setDefaultDescription(actualRow),
        },
        totalMonthlyItems: { placeholder: 'Total Monthly Items', value: 1 },
        existingFee: { placeholder: 'Existing', value: '0.0' },
        proposedFee: { placeholder: 'Proposed', value: '0.0' },
      };
      addNewRow(defaultRow);
    }
  };

  const drawRowsToUpdate = () => {
    report &&
      report.input.services.forEach((service) => {
        const { id, item_fee, name, proposed_item_fee, total_items } = service;
        const serviceRow = {
          id: id,
          description: {
            placeholder: 'Description',
            value: name,
          },
          totalMonthlyItems: {
            placeholder: 'Total Monthly Items',
            value: total_items,
          },
          existingFee: { placeholder: 'Existing', value: item_fee / 1000 },
          proposedFee: {
            placeholder: 'Proposed',
            value: proposed_item_fee / 1000,
          },
        };
        addNewRow(serviceRow);
      });
  };

  const setDefaultInputValues = (inputs, setValues) => {
    const newTextInputValues = [];
    inputs?.forEach((row, index) => {
      const rowId = `row_${index + 1}`;
      row?.forEach((cell) => {
        const inputId = `${rowId}_${cell.name}`;
        newTextInputValues[inputId] = cell.value;
      });
    });
    setValues(newTextInputValues);
  };

  const resetValues = () => {
    setTreasuryInputs([]);
    setTreasuryMainInputsValues([]);
  };

  useEffect(() => {
    resetValues();
    if (editMode) {
      drawRowsToUpdate();
    } else {
      drawDefaultRows(rowsToDrawNum);
    }
    setTreasuryMainInputs([mainInputs]);
  }, [report, editMode]);

  useEffect(() => {
    setTreasuryMainInputsValues([]);
    if (editMode) {
      const dateReport = moment.utc(report?.input.date).format('YYYY-MM-DD');
      const mainInputsValues = [
        {
          name: 'date',
          value: dateReport,
        },
        {
          name: 'existing_avr_balance',
          value: report?.input.average_balance / 1000,
        },
      ];
      setDefaultInputValues([mainInputsValues], setTreasuryMainInputsValues);
    } else {
      setDefaultInputValues(treasuryMainInputs, setTreasuryMainInputsValues);
    }
  }, [report, editMode]);

  const handleReplace = (block) => {
    const newBlock = {
      ...block,
      id: Math.random(),
    };
    setBlocks([...blocks, newBlock]);
    setShowModal(false);
    try {
      scrollToBottomContainer(document.getElementById('customReportContainer'));
    } catch (e) {}
  };

  return (
    <Modal
      size={`lg`}
      isOpen={showModal}
      fade={false}
      className={`modal-report`}
    >
      <ModalHeader tag="h3" close={closeBtn}>
        {constants.reportModal.title}
      </ModalHeader>
      <ModalBody className={`p-0 m-3`}>
        <ReportToolbar
          id={`modal-report-tabs`}
          activeTab={reportTab}
          setActiveTab={setReportTab}
          tabs={toolbarItems}
        />
        {reportTab === 'treasury' && (
          <>
            <Container fluid className={`px-4`}>
              <TextInputsTable
                id={`main_inputs`}
                inputList={treasuryMainInputs}
                inputValues={treasuryMainInputsValues}
                inputValuesHandler={(e) =>
                  handleMainTreasuryValues(e.target.name, e.target.value)
                }
              />
            </Container>
            <Container id={`add_row`} fluid className={`px-4 pb-2`}>
              <Row className={`align-items-center modal-header-table`}>
                <Col
                  className={`col-auto mt-3 p-0 font-weight-semi-bold text-medium`}
                >
                  <span className={`cell-numbers`}>{`#`}</span>
                </Col>
                <Col
                  className={`text-center mt-3 mb-0 font-weight-semi-bold text-medium`}
                >
                  {`Description`}
                </Col>
                <Col
                  className={`text-center mt-3 mb-0 font-weight-semi-bold text-medium`}
                >
                  {`Total Monthly Items`}
                </Col>
                <Col
                  className={`text-center mt-3 mb-0 font-weight-semi-bold text-medium`}
                >
                  {`Existing Fee`}
                </Col>
                <Col
                  className={`text-center mt-3 mb-0 font-weight-semi-bold text-medium`}
                >
                  {`Proposed Fee`}
                </Col>
                <Col className={`p-0 col-auto ml-3`}></Col>
              </Row>
              {treasuryInputs.map((treasuryRow, index) => (
                <Row
                  key={`${treasuryRow?.id}`}
                  className={`align-items-center`}
                >
                  <Col className={`col-auto p-0`}>
                    <span className={`cell-numbers`}>{index + 1}</span>
                  </Col>
                  <Col className={`p-0`}>
                    <TextInput
                      id={`${treasuryRow.id}_description`}
                      name={`${treasuryRow.id}_description`}
                      placeholder={treasuryRow?.description?.placeholder}
                      value={treasuryRow?.description?.value}
                      onChange={(e) => {
                        handleChangeTreasuryInput(
                          e.target.value,
                          'description',
                          treasuryRow
                        );
                      }}
                      className={`font-weight-500 mb-0`}
                      containerClassName={`m-1`}
                      formClassName={`m-0`}
                    />
                  </Col>
                  <Col className={`p-0`}>
                    <TextInput
                      id={`${treasuryRow.id}_monthly_items`}
                      name={`${treasuryRow.id}_monthly_items`}
                      placeholder={treasuryRow?.totalMonthlyItems?.placeholder}
                      value={treasuryRow?.totalMonthlyItems?.value}
                      onChange={(e) => {
                        handleChangeTreasuryInput(
                          e.target.value,
                          'totalMonthlyItems',
                          treasuryRow
                        );
                      }}
                      className={`font-weight-500 mb-0`}
                      containerClassName={`m-1`}
                      formClassName={`m-0`}
                    />
                  </Col>
                  <Col className={`p-0`}>
                    <TextInput
                      id={`${treasuryRow.id}_existing_fee`}
                      name={`${treasuryRow.id}_existing_fee`}
                      placeholder={treasuryRow?.existingFee?.placeholder}
                      value={treasuryRow?.existingFee?.value}
                      onChange={(e) => {
                        handleChangeTreasuryInput(
                          e.target.value,
                          'existingFee',
                          treasuryRow
                        );
                      }}
                      className={`font-weight-500 mb-0`}
                      containerClassName={`m-1`}
                      formClassName={`m-0`}
                    />
                  </Col>
                  <Col className={`p-0`}>
                    <TextInput
                      id={`${treasuryRow.id}_proposed_fee`}
                      name={`${treasuryRow.id}_proposed_fee`}
                      placeholder={treasuryRow?.proposedFee?.placeholder}
                      value={treasuryRow?.proposedFee?.value}
                      onChange={(e) => {
                        handleChangeTreasuryInput(
                          e.target.value,
                          'proposedFee',
                          treasuryRow
                        );
                      }}
                      className={`font-weight-500 mb-0`}
                      containerClassName={`m-1`}
                      formClassName={`m-0`}
                    />
                  </Col>
                  <Col className={`p-0 col-auto`}>
                    <CardButton
                      className={'font-weight-500 p-0'}
                      icon={`close`}
                      variant={``}
                      onClick={() => {
                        deleteRow(treasuryRow.id);
                      }}
                    />
                  </Col>
                </Row>
              ))}
            </Container>
            {reportTab === 'treasury' && (
              <Row>
                <Col className={`px-3 text-left`}>
                  <CardButton
                    id={`add_row_btn`}
                    disabled={treasuryInputs.length > 5 || false}
                    className={'font-weight-500'}
                    icon={`addchart`}
                    title={`Add new row`}
                    variant={``}
                    onClick={() => addNewRow(newTreasuryInputsRow)}
                  />
                </Col>
              </Row>
            )}
          </>
        )}
        {reportTab === 'custom' && (
          <ListGroup className="list-group-no-gutters mt-2 list-group-flush">
            {[...defaultReportBlocks].map((block) => (
              <BlockItem key={block.id} style="border mb-3 rounded-lg">
                <DynamicBlock
                  type={block.type}
                  {...block}
                  showAdd={() => handleReplace(block)}
                />
              </BlockItem>
            ))}
          </ListGroup>
        )}
      </ModalBody>
      <ModalFooter>
        <Col className={`col-auto p-0`}>
          <CardButton
            className={'font-weight-500 btn-white mr-2'}
            title={`Cancel`}
            onClick={handleCloseModal}
          />
          <CardButton
            className={'font-weight-500'}
            title={editMode ? `Update` : `Generate`}
            variant={`primary`}
            onClick={() => {
              editMode ? handleUpdate() : handleShowResults();
            }}
          />
        </Col>
      </ModalFooter>
    </Modal>
  );
};

export default ReportModal;
