import { TreasuryCalculation } from '../../reports/Treasury';

const TreasuryReport = (props) => {
  const isNumber =
    !props || !props.output || !isNaN(props.output.annual_estimated_savings);
  return !isNumber ? (
    <h4>{`Estimated value isn't numeric`}</h4>
  ) : (
    <TreasuryCalculation {...props} />
  );
};

export default TreasuryReport;
