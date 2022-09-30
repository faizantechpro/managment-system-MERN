import React, { useEffect, useState } from 'react';
import { Row, Col, Spinner, Form } from 'react-bootstrap';
import moment from 'moment-timezone';

import { CardSection } from '../../layouts/CardLayout';
import dataReportConstants from '../../../utils/constants/dataReport.json';
import { formateDate } from '../../../utils/Utils';
import reportService from '../../../services/report.service';
import ReportModal from './ReportModal';
import ReportToolbar from './ReportToolbar';
import TreasuryReport from './TreasuryReport';
import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import MerchantReport from './MerchantReport';
import CustomReport from './CustomReport';
import { defaultReportBlocks } from '../../reportbuilder/constants/reportBuilderConstants';
import ButtonIcon from '../../commons/ButtonIcon';

const constants = dataReportConstants.strings;

const Report = ({ children, className }) => (
  <Col xs={12} className={`${className || `p-0`}`}>
    {children}
  </Col>
);

const AddDataReport = ({
  organizationId,
  profileInfo,
  getProfileInfo,
  isPrincipalOwner,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportResultsTab, setReportResultsTab] = useState('custom');
  const [showResults, setShowResults] = useState(false);
  const [merchantReportData, setMerchantReportData] = useState(false);
  const [fromDate, setFromDate] = useState(false);
  const [toDate, setToDate] = useState(false);
  const [treasuryReport, setTreasuryReport] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [colorToast, setColorToast] = useState('success');
  const [editMode] = useState(false);
  const [mid, setMid] = useState(null);
  const [editCustomReport, setEditCustomReport] = useState(false);
  const [customReportName, setCustomReportName] = useState('Custom Report');
  const [fetchMerchantReport, setFetchMerchantReport] = useState(false);
  const [toolbarItems, setToolBarItems] = useState(
    dataReportConstants.tabs.toolbarModal
  );
  const [blocks, setBlocks] = useState([...defaultReportBlocks]);

  const getRecentReports = () => {
    reportService
      .getLeadReport(organizationId, 'TREASURY')
      .then((res) => {
        if (res.pagination.count > 0) {
          const report = res.data[0];
          setTreasuryReport(report);
          if (report?.output) {
            setShowResults(true);
          }
          getProfileInfo();
        }
      })
      .catch((err) => console.log(err));
  };

  const setSelectedDuration = (fromDate, toDate) => {
    setFromDate(fromDate);
    setToDate(toDate);

    // const d = new Date();
    // switch (id) {
    //   case 0:
    //     setFromDate(formateDate(d.getMonth() - 1, 1, d.getFullYear()));
    //     setToDate(formateDate(d.getMonth(), 30, d.getFullYear()));
    //     break;
    //   case 1:
    //     setFromDate(formateDate(d.getMonth() - 3, 1, d.getFullYear()));
    //     setToDate(formateDate(d.getMonth(), 30, d.getFullYear()));
    //     break;
    //   case 2:
    //     setFromDate(formateDate(d.getMonth() - 6, 1, d.getFullYear()));
    //     setToDate(formateDate(d.getMonth(), 30, d.getFullYear()));
    //     break;
    //   case 3:
    //     setFromDate(formateDate(1, 1, d.getFullYear()));
    //     setToDate(formateDate(d.getMonth(), d.getDate(), d.getFullYear()));
    //     break;
    //   default:
    //     setFromDate(formateDate(d.getMonth() - 1, 1, d.getFullYear()));
    //     setToDate(formateDate(d.getMonth(), 30, d.getFullYear()));
    // }
    setFetchMerchantReport(true);
  };
  const getMerchantReport = (MID) => {
    setGenerating(true);
    reportService
      .getMerchantReport(MID, fromDate, toDate)
      .then((res) => {
        if (res) {
          setGenerating(false);
          setMerchantReportData(res);
          setShowResults(true);
        }
      })
      .catch((err) => {
        setGenerating(false);
        console.log(err);
      });
  };

  const createReport = (data) => {
    const reportDate = moment.utc(data?.input.date).format('YYYY-MM-DD');

    const report = {
      input: data.input,
      month: reportDate,
    };
    reportService
      .createLeadReport(organizationId, report)
      .then((report) => {
        setGenerating(false);
        setTreasuryReport(report);
        if (report?.output) {
          setShowResults(true);
        }
        getProfileInfo();
      })
      .catch((err) => console.log(err));
  };

  const updateReport = (data, id) => {
    const reportDate = moment.utc(data?.input.date).format('YYYY-MM-DD');

    const report = {
      input: data.input,
      month: reportDate,
    };
    reportService
      .updateLeadReport(organizationId, id, report)
      .then((report) => {
        setGenerating(false);
        setTreasuryReport(report);
        if (report?.output) {
          setShowResults(true);
        }
        setToast('The report has been successfully updated');
        setColorToast(constants.colors.success);
        getProfileInfo();
      })
      .catch((err) => {
        console.log(err);
        //
      });
  };

  /**
   * Extracts the input values for date, balance, and credit rates
   */
  const extractReportInputPayload = (input) => {
    const extractedValues = {
      type: 'TREASURY',
      client_name: profileInfo.name,
      proposed_bank_name: '',
      services:
        input?.treasuryInputs?.map((row, idx) => ({
          name: row.description.value,
          proposed_item_fee: parseFloat(row.proposedFee.value) * 1000,
          item_fee: parseFloat(row.existingFee.value) * 1000, // currency is represented in cents
          total_items: parseInt(row.totalMonthlyItems.value),
          id: idx,
        })) || [],
    };

    Object.entries(input.treasuryMainInputsValues).forEach(([key, value]) => {
      if (key.endsWith('existing_avr_balance')) {
        extractedValues.average_balance = parseFloat(value) * 1000;
      } else if (key.endsWith('date')) {
        extractedValues.date = value;
      }
    });
    return extractedValues;
  };

  const generateReport = async (userInput) => {
    const report = {
      input: {
        ...extractReportInputPayload(userInput),
      },
    };
    createReport(report);
  };

  const generateReportToUpdate = async (userInput) => {
    const report = {
      input: {
        ...extractReportInputPayload(userInput),
      },
    };
    updateReport(report, userInput.reportId);
  };

  useEffect(() => {
    getRecentReports();
    setShowResults(true);
  }, []);

  useEffect(() => {
    if (mid && fromDate && toDate && fetchMerchantReport) {
      getMerchantReport(mid);
    }
  }, [fetchMerchantReport, fromDate, toDate]);

  useEffect(() => {
    if (reportResultsTab === 'treasury' && !treasuryReport?.output && mid) {
      setShowReportModal(true);
    }
  }, [reportResultsTab]);

  useEffect(() => {
    if (profileInfo) {
      let MID = '';
      profileInfo?.fields?.forEach((key) => {
        const { field, value } = key;

        if (field.key === 'MID') {
          MID = value || '';
        }
      });
      if (MID) {
        setMid(MID);
        const d = new Date();
        setFromDate(formateDate(d.getMonth(), 1, d.getFullYear()));
        setToDate(formateDate(d.getMonth(), 30, d.getFullYear()));

        setFetchMerchantReport(true);

        setReportResultsTab(MID ? 'merchant' : 'treasury');
        MID
          ? setToolBarItems(dataReportConstants.tabs.toolbar)
          : setToolBarItems(dataReportConstants.tabs.toolbarModal);
      }
    }
  }, [profileInfo]);

  const handleCancelReportName = () => {
    setCustomReportName(toolbarItems[0].label);
    setToolBarItems([{ name: 'custom', label: toolbarItems[0].label }]);
    setEditCustomReport(false);
  };

  const handleSaveReportName = () => {
    setToolBarItems([{ name: 'custom', label: customReportName }]);
    setEditCustomReport(false);
  };

  return (
    <>
      <CardSection className="m-0 p-0">
        <AlertWrapper>
          <Alert message={toast} setMessage={setToast} color={colorToast} />
        </AlertWrapper>
        {showReportModal && (
          <ReportModal
            showModal={showReportModal}
            setShowModal={setShowReportModal}
            generateReport={generateReport}
            generateReportToUpdate={generateReportToUpdate}
            setGenerating={setGenerating}
            setToast={setToast}
            setColorToast={setColorToast}
            editMode={editMode}
            report={treasuryReport}
            blocks={blocks}
            setBlocks={setBlocks}
          />
        )}

        {generating && (
          <Col xs={12} className={`text-center p-5`}>
            <Spinner
              animation="border"
              className={'justify-content-md-center align-items-center pb-4'}
            />
          </Col>
        )}
        {showResults && (
          <Report className={`pb-5 px-0`}>
            {isPrincipalOwner && (
              <Row className={`m-0 pt-3 align-items-center`}>
                <Col md={6} className="px-0">
                  {!editCustomReport ? (
                    <ReportToolbar
                      id={`modal-report-tabs`}
                      activeTab={reportResultsTab}
                      setActiveTab={setReportResultsTab}
                      setSelectedDuration={setSelectedDuration}
                      tabs={toolbarItems}
                      classNameRow={`m-0 pt-1`}
                    />
                  ) : (
                    <div className="px-3">
                      <Form.Control
                        type="text"
                        onChange={(e) => setCustomReportName(e.target.value)}
                        value={customReportName}
                      />
                    </div>
                  )}
                </Col>
                <Col
                  className={`text-right d-flex align-items-center justify-content-end pr-3`}
                >
                  {editCustomReport && (
                    <ButtonIcon
                      label={'Cancel'}
                      onclick={handleCancelReportName}
                      color="white"
                      classnames="btn-sm mr-1"
                    />
                  )}
                  <ButtonIcon
                    icon={editCustomReport ? 'save' : 'edit'}
                    label={editCustomReport ? 'Save' : 'Edit'}
                    onclick={
                      editCustomReport
                        ? handleSaveReportName
                        : () => setEditCustomReport(!editCustomReport)
                    }
                    color="primary"
                    classnames="btn-sm"
                  />
                </Col>
              </Row>
            )}
            <div className="position-relative border-top mt-3">
              {reportResultsTab === 'treasury' && treasuryReport?.output && (
                <TreasuryReport {...treasuryReport} />
              )}
              {reportResultsTab === 'merchant' && mid && merchantReportData && (
                <MerchantReport merchantReportData={merchantReportData} />
              )}
              {reportResultsTab === 'custom' && (
                <CustomReport blocks={blocks} setBlocks={setBlocks} />
              )}
              {editCustomReport && (
                <div className="position-absolute drop-disabled h-100 w-100 top-0 left-0" />
              )}
            </div>
          </Report>
        )}
      </CardSection>
    </>
  );
};

export default AddDataReport;
