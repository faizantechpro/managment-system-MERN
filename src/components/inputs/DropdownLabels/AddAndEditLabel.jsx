import { useState, useEffect, useContext } from 'react';
import { Input, Col } from 'reactstrap';

import { labelsHexByDefect } from '../../../views/Deals/contacts/Contacts.constants';
import stringConstants from '../../../utils/stringConstants.json';
import labelServices from '../../../services/labels.service';
import { AlertMessageContext } from '../../../contexts/AlertMessageContext';

const constantsMod = stringConstants.modals.modalLabels;

const AddAndEditLabel = ({
  sectionAdd,
  sectionEdit,
  setIsMenuOpen,
  label,
  selectLabel,
  getLabels,
  refresh,
  type,
  isRefresh,
  setProfileInfo,
  profileInfo,
}) => {
  const { setSuccessMessage, setErrorMessage } =
    useContext(AlertMessageContext);
  const [check, setCheck] = useState();
  const [txtLabel, setTxtLabel] = useState('');

  useEffect(() => {
    if (label && !sectionAdd) {
      setCheck(label.color);
      setTxtLabel(label.name);
    } else {
      setCheck();
      setTxtLabel('');
    }
  }, [label]);

  const createLabel = async (color, name, type) => {
    try {
      const newLabel = await labelServices.createLabel({
        color,
        name,
        type,
      });

      selectLabel(newLabel);
      setIsMenuOpen(false);
      getLabels();
      setSuccessMessage(constantsMod.labelAdded);
    } catch (error) {
      if (error?.response?.status === 409) {
        setErrorMessage(error?.response?.data?.error);
      } else setErrorMessage(constantsMod.labelError);
      setIsMenuOpen(false);
    }
  };

  const editLabel = async (color, name) => {
    try {
      const result = await labelServices.editLabel(label.id, {
        color,
        name,
        type,
      });

      if (result?.response?.status === 400) {
        return setErrorMessage(constantsMod.errorUpdateLabel);
      }

      const newLabel = { ...label, color, name };
      selectLabel(newLabel);
      setIsMenuOpen(false);
      getLabels();
      setSuccessMessage(constantsMod.updateLabel);

      refresh(newLabel);
    } catch (error) {
      if (error?.response?.status === 409) {
        setErrorMessage(error?.response?.data?.error);
      } else setErrorMessage(constantsMod.errorUpdateLabel);
      setIsMenuOpen(false);
    }
  };

  const removeLabel = async () => {
    try {
      await labelServices.removeLabel(label.id);

      setIsMenuOpen(false);
      setSuccessMessage(constantsMod.removeLabel);
      selectLabel();
      getLabels();
      setCheck();
      setTxtLabel('');
      refresh();
    } catch (error) {
      if (error?.response?.status === 409) {
        setErrorMessage(error?.response?.data?.error);
      } else setErrorMessage(constantsMod.errorRemoveLabel);
      setIsMenuOpen(false);
    }
  };

  const submit = () => {
    if (sectionAdd) createLabel(check, txtLabel, type);
    if (sectionEdit) editLabel(check, txtLabel, type);
    setCheck();
    setTxtLabel('');
  };

  return (
    <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
      {sectionAdd && (
        <span className="card-title section-title text-left mb-3">Add</span>
      )}
      {sectionEdit && (
        <span className="card-title section-title text-left mb-3">Edit</span>
      )}
      <Input
        className="input-label text-uppercase"
        type="text"
        name="label_name"
        id="label_name"
        onClick={(e) => e.stopPropagation()}
        value={txtLabel}
        onChange={(e) => {
          e.stopPropagation();
          setTxtLabel(e.target.value);
        }}
        placeholder={constantsMod.placeholderInput}
      />
      <div className={'palette-colors w-100 px-0'}>
        {labelsHexByDefect.map((item) => (
          <div
            className="each-palette w-25"
            key={`${item.id}-${item.color}`}
            style={{ backgroundColor: `${item.color}` }}
            onClick={(e) => {
              e.stopPropagation();
              setCheck(item.color);
            }}
          >
            {check === item.color ? (
              <span className="material-icons-outlined text-white w-100 align-self-center">
                check
              </span>
            ) : (
              <span>{` `}</span>
            )}
          </div>
        ))}
      </div>
      <Col className="d-flex p-0">
        <Col className="text-left pl-1">
          {!sectionAdd ? (
            <p
              className="material-icons-outlined btn btn-outline-danger m-0 h-100"
              data-uw-styling-context="true"
              onClick={() => removeLabel()}
            >
              {'delete_outline'}
            </p>
          ) : null}
        </Col>
        <div className="text-right w-50">
          <p
            className="btn btn-white mr-2 mb-0"
            onClick={() => setIsMenuOpen(false)}
          >
            Cancel
          </p>
          <p
            type="button"
            className={`btn btn-primary mb-0 ${
              !check || !txtLabel.length ? 'btn-disabled' : ''
            }`}
            onClick={!check || !txtLabel.length ? null : submit}
          >
            <span>{constantsMod.buttonSave}</span>
          </p>
        </div>
      </Col>
    </div>
  );
};

export default AddAndEditLabel;
