import MaterialTooltip from '@material-ui/core/Tooltip';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import {
  Col,
  OverlayTrigger,
  ProgressBar,
  Row,
  Tooltip,
} from 'react-bootstrap';
import SPGlobal from './../../../assets/svg/brands/logo-spglobal.svg';

const renderTooltip = (props, text) => {
  return (
    <Tooltip id="button-tooltip" className="idf-tooltip" {...props}>
      {text}
    </Tooltip>
  );
};

const renderProgressBar = (summaryValue) => {
  return (
    <ProgressBar style={{ height: 15 }}>
      <OverlayTrigger
        defaultShow={true}
        overlay={(props) => renderTooltip(props, summaryValue)}
        placement="top"
        show={summaryValue < 34}
      >
        <ProgressBar
          isChild={true}
          variant={`orange`}
          now={35}
          max={100}
          key={1}
        />
      </OverlayTrigger>
      <OverlayTrigger
        defaultShow={true}
        overlay={(props) => renderTooltip(props, summaryValue)}
        placement="top"
        show={summaryValue > 33 && summaryValue < 67}
      >
        <ProgressBar
          isChild={true}
          variant={`yellow`}
          now={35}
          max={100}
          key={2}
        />
      </OverlayTrigger>
      <OverlayTrigger
        defaultShow={true}
        overlay={(props) => renderTooltip(props, summaryValue)}
        placement="top"
        show={summaryValue > 66}
      >
        <ProgressBar
          isChild={true}
          variant={`green`}
          now={35}
          max={100}
          key={3}
        />
      </OverlayTrigger>
    </ProgressBar>
  );
};

const WorkingCapital = ({ naicsSpSummary }) => {
  const reportDate = new Date(naicsSpSummary?.report_date);
  const formattedDate = `${
    reportDate.getMonth() + 1
  }/${reportDate.getDate()}/${reportDate.getFullYear()}`;
  const formattedTitle = `S&P Global Data from ${formattedDate}`;

  return (
    <div className="mt-3 working-capital px-4">
      <Row>
        <Col xs="8">
          <h4 className="text-left">
            Market Intelligence{' '}
            <MaterialTooltip title={formattedTitle} className="idf-tooltip">
              <InfoIcon sx={{ fontSize: '1em' }} />
            </MaterialTooltip>
          </h4>
        </Col>
        <Col xs="4" className="text-right">
          <img
            style={{ width: 80, height: 20, marginTop: -5 }}
            src={SPGlobal}
            alt="S&P Global"
          />
        </Col>
      </Row>
      {naicsSpSummary ? (
        <>
          <Row>
            <Col>
              <h5 className="text-left mt-4 mb-6">
                Working Capital Ratio (WCR)
              </h5>
              {renderProgressBar(naicsSpSummary?.working_capital_ratio)}
            </Col>
          </Row>
          <Row>
            <Col>
              <h5 className="text-left mt-4 mb-6">
                Days Payables Outstanding (DPO)
              </h5>
              {renderProgressBar(naicsSpSummary?.days_sales_out)}
            </Col>
          </Row>
          <Row>
            <Col>
              <h5 className="text-left mt-4 mb-6">
                Days Sales Outstanding (DSO)
              </h5>
              {renderProgressBar(naicsSpSummary?.days_payable_out)}
            </Col>
          </Row>
        </>
      ) : (
        <div className="container-fluid p-4">
          <h5> No working capital insight found</h5>
        </div>
      )}
    </div>
  );
};

export default WorkingCapital;
