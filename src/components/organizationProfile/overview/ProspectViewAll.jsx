import { useState } from 'react';
import { Image } from 'react-bootstrap';

import { CardButton } from '../../layouts/CardLayout';
import emailCircle from '../../../assets/svg/email-circle.svg';
import phoneCircle from '../../../assets/svg/phone-circle.svg';

const ViewAllInfo = ({ data }) => {
  const emailsCount = data?.emails?.length;
  const phonesCount = data?.phones?.length;

  const [viewInfoClick, setViewInfoClick] = useState(false);

  if (viewInfoClick)
    return (
      <div style={{ textAlign: 'left', marginTop: '5px' }}>
        {data?.emails?.map((email) => (
          <p key={email} style={{ mrgin: 0, padding: 0 }}>
            <Image src={emailCircle} />
            <span>{email}</span>
          </p>
        ))}

        {data?.phones?.map((phone) => (
          <p key={phone.number} style={{ mrgin: 0, padding: 0 }}>
            <Image src={phoneCircle} />
            <span>{phone.number}</span>
          </p>
        ))}
      </div>
    );

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      <div className="d-flex">
        {emailsCount > 0 && (
          <div className="mr-3">
            <Image src={emailCircle} className="mr-2" />
            <span>{emailsCount} emails</span>
          </div>
        )}

        {phonesCount > 0 && (
          <div>
            <Image src={phoneCircle} className="mr-2" />
            <span>{phonesCount} phone</span>
          </div>
        )}
      </div>

      <CardButton
        type="button"
        title="View Info"
        variant="white"
        className={`mr-2`}
        icon="visibility"
        onClick={() => setViewInfoClick(true)}
      />
    </div>
  );
};

export default ViewAllInfo;
