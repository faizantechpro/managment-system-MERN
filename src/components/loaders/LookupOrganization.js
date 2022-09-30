import LookupPeopleLoader from './LookupPeople';
import IconTextLoader from './IconText';
import CardWrapper from './CardWrapper';
import Skeleton from 'react-loading-skeleton';
import React from 'react';

const LookupOrganization = () => {
  return (
    <CardWrapper>
      <LookupPeopleLoader
        count={1}
        lineCount={1}
        circle={<Skeleton height={60} width={60} circle />}
      />
      <IconTextLoader count={8} />
    </CardWrapper>
  );
};

export default LookupOrganization;
