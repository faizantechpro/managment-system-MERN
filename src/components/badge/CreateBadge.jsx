import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

import badgeService from '../../services/badge.service';
import { BADGE_ICONS, DEFAULT_FORM_VALUES } from './CreateBadge.constants';
import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.resources.badges;

const CreateBadge = ({
  setCreateMode,
  setId,
  id,
  setErrorMessage,
  setSuccessMessage,
}) => {
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const saveBadge = async () => {
    if (!formValues.name) {
      setErrorMessage(constants.requiredFieldError);
    } else {
      if (id) {
        await badgeService.updateBadge(id, formValues);
        setFormValues(formValues);
        setSuccessMessage(constants.badgeUpdatedMessage);
      } else {
        const newStatus = constants.draftStatus;

        await badgeService
          .createBadge({ ...formValues, status: newStatus })
          .then(({ data }) => {
            const { id: badgeId } = data;
            setId(badgeId);
            setFormValues({ ...formValues, status: newStatus });
            setSuccessMessage(constants.badgeCreatedMessage);
          });
      }
    }
  };

  const updateStatus = async (status) => {
    await badgeService.updateBadge(id, {
      id,
      status,
    });
    setFormValues({ ...formValues, status });

    const message =
      formValues.status === constants.draftStatus
        ? constants.badgePublished
        : constants.badgeUnpublished;
    setSuccessMessage(message);
  };

  const getBadgeData = async (id) => {
    const badgeInfo = await badgeService.getBadge(id);
    setFormValues({
      name: badgeInfo.name,
      description: badgeInfo.description,
      badge_url: badgeInfo.badge_url,
      status: badgeInfo.status,
    });
  };

  useEffect(() => {
    if (id) {
      getBadgeData(id);
    }
  }, []);

  return (
    <div className="row justify-content-center">
      <div className="col-lg-12">
        <Card>
          <CardHeader>
            <CardTitle className="d-flex align-items-baseline w-lg-25">
              <button
                className="btn btn-light btn-sm mr-2 border-secondary"
                onClick={() => {
                  setId(null);
                  setCreateMode(false);
                }}
              >
                <span className="material-icons-outlined">arrow_back</span>
              </button>
              <h4>{constants.title}</h4>
            </CardTitle>
            <div>
              <button
                className="btn btn-light border-secondary btn-sm mr-2"
                disabled={formValues.status === constants.publishedStatus}
                onClick={() => {
                  saveBadge();
                }}
              >
                {constants.saveLabel}
              </button>
              <button
                className="btn btn-primary btn-sm border-0 btn-primary-dark"
                disabled={!id}
                onClick={() => {
                  const status =
                    formValues.status === constants.draftStatus
                      ? constants.publishedStatus
                      : constants.draftStatus;
                  updateStatus(status);
                }}
              >
                {!formValues.status ||
                formValues.status === constants.draftStatus
                  ? constants.publishBadgeLabel
                  : constants.unpublishBadgeLabel}
              </button>
            </div>
          </CardHeader>

          <CardBody>
            <FormGroup row>
              <Label for="icon" sm={2}>
                {constants.iconLabel}
              </Label>
              <Col sm={3}>
                <Input
                  type="select"
                  name="badge_url"
                  id="icon"
                  defaultValue={formValues.badge_url}
                  value={formValues.badge_url}
                  onChange={onChange}
                >
                  {BADGE_ICONS.map((iconItem) => {
                    return (
                      <option key={iconItem.name} value={iconItem.name}>
                        {iconItem.value}
                      </option>
                    );
                  })}
                </Input>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="name" sm={2}>
                {constants.nameLabel}
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder={constants.nameLabel}
                  value={formValues.name}
                  onChange={onChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="description" sm={2}>
                {constants.descriptionLabel}
              </Label>
              <Col sm={10}>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  placeholder={constants.descriptionLabel}
                  value={formValues.description}
                  onChange={onChange}
                />
              </Col>
            </FormGroup>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CreateBadge;
