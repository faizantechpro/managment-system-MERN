import React from 'react';

import BadgeIcon from '../../../../components/badge/BadgeIcon';

const Badges = ({ badgeList }) => {
  return (
    <>
      <div className="d-flex justify-content-start flex-wrap">
        {badgeList.map((badge) => (
          <BadgeIcon
            key={badge?.id}
            badgeName={badge?.badge_url}
            name={badge?.name}
            className="mr-4 mb-4"
            bigIcon
            tooltip
          />
        ))}
      </div>
    </>
  );
};

export default Badges;
