import { useState, useEffect, useContext } from 'react';
import { FormGroup, Label, Col } from 'reactstrap';

import { LABEL } from '../../../utils/constants';
import Alert from '../../Alert/Alert';
import AlertWrapper from '../../Alert/AlertWrapper';
import DropdownLabels from '../../inputs/DropdownLabels/DropdownLabels';
import stringConstants from '../../../utils/stringConstants.json';
import labelServices from '../../../services/labels.service';
import { AlertMessageContext } from '../../../contexts/AlertMessageContext';

const IdfSelectLabel = ({ value, type, onChange, refresh }) => {
  const constantsOrg = stringConstants.deals.organizations;

  const { setSuccessMessage, setErrorMessage, successMessage, errorMessage } =
    useContext(AlertMessageContext);
  const [label, setLabel] = useState([]);
  const [checkGetDeals, setCheckGetDeals] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(async () => {
    const labels = await getLabels().catch((err) => console.log(err));

    setLabel(labels || []);
  }, [checkGetDeals]);

  useEffect(() => setSelected(value?.label || null), [value?.label]);

  const getLabels = async () => {
    return await labelServices.getLabels(type).catch((err) => console.log(err));
  };

  const fieldInFields = (item) => {
    onChange({
      target: {
        name: 'label_id',
        value: item.id,
      },
    });
  };

  return (
    <>
      <FormGroup>
        <Label htmlFor="label_id" className="d-block">
          {LABEL}
        </Label>
        <Col className="d-flex justify-content-between p-0 w-100">
          <DropdownLabels
            value={selected}
            options={label}
            getLabels={() => setCheckGetDeals(!checkGetDeals)}
            placeholder={constantsOrg.placeholderDropdownLabels}
            onHandleSelect={(item) => fieldInFields(item)}
            refresh={refresh}
            btnAddLabel={constantsOrg.buttonAddLabels}
            type={type}
          />
        </Col>
      </FormGroup>

      <AlertWrapper>
        <Alert message={successMessage} setMessage={setSuccessMessage} />
        <Alert
          color="danger"
          message={errorMessage}
          setMessage={setErrorMessage}
        />
      </AlertWrapper>
    </>
  );
};

export default IdfSelectLabel;
