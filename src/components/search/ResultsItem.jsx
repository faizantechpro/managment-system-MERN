import { Col, ListGroup, Row } from 'react-bootstrap';
import filesService from '../../services/files.service';
import fileDownload from 'js-file-download';
import routes from '../../utils/routes.json';
import constants from './GlobalSearch.constants.json';
import stringConstants from '../../utils/stringConstants.json';
import { replaceSpaceWithCharacter } from '../../utils/Utils';

export const ResultsItem = ({
  keyMap,
  type,
  dealName,
  dealId,
  contactName,
  contactId,
  organizationName,
  organizationId,
  lessonId,
  lessonName,
  categoryName,
  courseId,
  courseName,
  activityId,
  activityName,
  activityType,
  fileId,
  fileName,
  setToast,
}) => {
  const getSubItemData = () => {
    const subIconOwner =
      (contactId && 'person') ||
      (organizationId && 'corporate_fare') ||
      (dealId && 'monetization_on') ||
      '';

    const subTextOwner =
      (contactId && contactName) ||
      (organizationId && organizationName) ||
      (dealId && dealName) ||
      '';

    const subItemData = {
      deal: {
        iconA: 'person',
        textA: contactName,
        iconB: 'corporate_fare',
        textB: organizationName,
      },
      contact: {
        iconA: 'corporate_fare',
        textA: organizationName,
      },
      organization: {
        iconA: 'person',
        textA: contactName,
      },
      lesson: lessonName,
      course: courseName,
      category: categoryName,
      activity: {
        iconA: subIconOwner,
        textA: subTextOwner,
      },
      file: {
        iconA: subIconOwner,
        textA: subTextOwner,
      },
    };

    return {
      iconA: subItemData[type].iconA,
      textA: subItemData[type].textA,
      iconB: subItemData[type].iconB,
      textB: subItemData[type].textB,
    };
  };

  const mainIconsList = constants.mainIconsList;
  const contactActivityButtons =
    stringConstants.deals.contacts.profile.activities.buttons;

  const queryTitles = {
    contact: contactName,
    deal: dealName,
    organization: organizationName,
    lesson: lessonName,
    course: courseName,
    category: categoryName,
    activity: activityName,
    file: fileName,
  };

  const contactPath = `${routes.contacts}/${contactId}/profile`;
  const organizationPath = `/contacts/${organizationId}/organization/profile`;
  const dealPath = `${routes.dealsPipeline}/${dealId}`;

  const ownerPath =
    (contactId && contactPath) ||
    (organizationId && organizationPath) ||
    (dealId && dealPath) ||
    '';

  const activityPath = `${ownerPath}/activity/${activityId}`;

  const queryPaths = {
    contact: contactPath,
    deal: dealPath,
    organization: organizationPath,
    lesson: `${routes.lesson.replace(':id', lessonId)}`,
    category: `${routes.categories}/${replaceSpaceWithCharacter(
      categoryName?.toLowerCase()
    )}`,
    course: `${routes.courses}/${courseId}`,
    activity: activityPath,
    file: ownerPath,
  };

  const getItemTitle = (type) => {
    return queryTitles[type] || '';
  };

  const getItemPath = (type) => {
    return queryPaths[type] || '';
  };

  const redirectHandler = (e, path) => {
    e.preventDefault();
    document.location.href = path;
  };

  const fileRedirectHandler = () => {
    document.location.href =
      (contactId && contactPath) ||
      (organizationId && organizationPath) ||
      (dealId && dealPath);
  };

  const downloadFile = (e) => {
    e.preventDefault();
    filesService
      .getFile(fileId)
      .then((response) => {
        fileDownload(response?.data, response?.data?.filename_download);
        setToast({ message: 'Download started', color: 'success' });
      })
      .catch((err) => setToast({ message: err.message, color: 'danger' }));
  };

  let mainIcon = mainIconsList[type];
  const title = getItemTitle(type);
  const path = getItemPath(type);
  const subItemData = getSubItemData();
  if (type === 'activity') {
    // get activity icon based on activityType
    mainIcon = contactActivityButtons.find(
      ({ type }) => type === activityType
    )?.icon;
  }
  const ResultItem = ({ children }) => (
    <ListGroup.Item
      key={keyMap}
      action
      className="rounded fw-bold fs-7 border-0 global-search-item py-1"
    >
      <Row className="pl-2">
        <Col
          className="col-auto p-0 main-icon"
          onClick={(e) => {
            type === 'file' ? fileRedirectHandler() : redirectHandler(e, path);
          }}
        >
          <span className="material-icons-outlined mr-2">{mainIcon}</span>
        </Col>
        <Col
          className="p-0"
          onClick={(e) => {
            type === 'file' ? fileRedirectHandler() : redirectHandler(e, path);
          }}
        >
          <Row>
            <Col>{title}</Col>
          </Row>
          {children}
        </Col>
        {type === 'file' && (
          <Col
            role="button"
            onClick={(e) => downloadFile(e)}
            className="col-auto p-0 main-icon"
          >
            <span className="material-icons-outlined mr-2">download</span>
          </Col>
        )}
      </Row>
    </ListGroup.Item>
  );

  const stripText = (text, maxLength) => {
    if (text && text.length > maxLength) {
      return text.substr(0, maxLength) + '...';
    }
    return text;
  };

  const SubItem = ({ icon, text }) => {
    return text ? (
      <div className="pr-2">
        <div className="d-flex align-items-center">
          <div className="pr-1">
            <span className="material-icons-outlined fs-7 item-text-secondary">
              {icon || ''}
            </span>
          </div>
          <div className="p-0 item-text-secondary">
            {stripText(text, 20) || ''}
          </div>
        </div>
      </div>
    ) : null;
  };

  return (
    <ResultItem>
      {(subItemData.textA || subItemData.textB) && (
        <div className="d-flex align-items-center">
          <SubItem icon={subItemData.iconA} text={subItemData.textA} />
          <SubItem icon={subItemData.iconB} text={subItemData.textB} />
        </div>
      )}
    </ResultItem>
  );
};
