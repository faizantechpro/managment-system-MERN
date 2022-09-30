import { categoriesDefaultInfo } from './constants/Category.constants';
import Card from '../../../components/lesson/card';
import SubHeading from '../../../components/subheading';
import React from 'react';
import CardSkeleton from '../../../components/lesson/CardSkeleton';

const CategorySection = ({
  data,
  setData,
  loading,
  slug,
  title,
  sectionType,
}) => {
  const sectionCcontent = () => {
    if (loading)
      return (
        <>
          <SubHeading title={title} />
          <CardSkeleton count={3} />
        </>
      );

    if (data.length > 0) {
      return (
        <>
          <SubHeading title={title} />
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
            {data?.map((item) => (
              <div key={item.id} className="col mb-5">
                <Card
                  item={item}
                  setItem={setData}
                  icon={categoriesDefaultInfo[slug]?.icon || 'summarize'}
                  sectionType={sectionType}
                />
              </div>
            ))}
          </div>
        </>
      );
    }

    return '';
  };

  return <>{sectionCcontent()}</>;
};

export default CategorySection;
