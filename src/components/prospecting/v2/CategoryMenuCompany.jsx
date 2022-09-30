import React from 'react';
import Wrapper from './common/Wrapper';
import { employeeCountListNew, revenueListNew } from './constants';
import _ from 'lodash';

const CategoryMenuCompany = ({
  stepItems = [],
  title,
  data,
  setData,
  onEnter,
  active,
  setActive,
}) => {
  const buildList = (list, optionList) => {
    return list
      .map((it) => {
        return _.find(optionList, { value: it })?.key;
      })
      .join(', ');
  };

  const toString = (key, keyChildren = [], titles) => {
    let string = '';
    const current = data[key];

    keyChildren.forEach((item, index) => {
      if (Array.isArray(current?.[item])) {
        if (current[item]?.length) {
          string = `${titles[index]}: "${current[item]}"${
            string === '' ? '' : ','
          } ${string} `;
        }
        // some exceptions
        if (string) {
          if (keyChildren.includes('revenue')) {
            const revenueString = buildList(current?.[item], revenueListNew);
            string = `${titles[index]}: "${revenueString}"`;
          } else if (keyChildren.includes('employees')) {
            const employeeSizeString = buildList(
              current?.[item],
              employeeCountListNew
            );
            string = `${titles[index]}: "${employeeSizeString}"`;
          }
        }
      } else {
        if (current?.[item]?.trim()) {
          string = `${titles[index]}: "${current[item]}"${
            string === '' ? '' : ','
          } ${string} `;
        }
      }
    });

    return string;
  };

  return (
    <>
      {stepItems[title].map(
        ({ components, icon, keyFilter, titleWrapper, id, titles }, i) => {
          return (
            <Wrapper
              key={i}
              value={toString(title, keyFilter, titles)}
              title={titleWrapper || title}
              icon={icon}
              active={active}
              setActive={setActive}
              id={id}
            >
              {components.map(({ component }, j) => {
                return React.cloneElement(component, {
                  key: j,
                  data,
                  setData,
                  onEnter,
                });
              })}
            </Wrapper>
          );
        }
      )}
    </>
  );
};

export default CategoryMenuCompany;
