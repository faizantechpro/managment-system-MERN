import { useState, useEffect } from 'react';
import { FormGroup, Label } from 'reactstrap';

import IdfSimpleSearch from './IdfSimpleSearch';
import mapService from '../../../services/map.service';
import { splitAddress } from '../../../utils/Utils';

const IdfSearchDirections = ({
  label,
  value,
  onChange,
  addActivity,
  fromNavBar = false,
  ...restProps
}) => {
  const [dataLocations, setDataLocations] = useState([]);

  useEffect(() => {
    if (value?.address_street || value) {
      onDirections(value?.address_street || value);
    }
  }, [value?.address_street || value]);

  const onDirections = async (value) => {
    const response = await mapService
      .getGoogleAddress(value)
      .catch((err) => console.log(err));

    const { data } = response || {};

    setDataLocations(data);
  };

  const onGetDirection = async (e) => {
    onChange(e);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();

      onChange({
        target: {
          name: e.target.name,
          value: `${e.target.value} `,
        },
      });
    }
  };

  const fieldInFields = (e, item) => {
    const { city, address, state } = splitAddress(item);

    if (fromNavBar) {
      // just handling add organization popup flow where we need to show full address on selection
      onChange({
        target: {
          name: 'address_full',
          value: item,
        },
      });
      onChange({
        target: {
          name: 'address_street',
          value: item.name,
        },
      });
    } else {
      onChange({
        target: {
          name: 'address_street',
          value: address,
        },
      });
    }

    onChange({
      target: {
        name: 'address_city',
        value: city,
      },
    });

    onChange({
      target: {
        name: 'address_state',
        value: state.name || '',
      },
    });
  };

  return (
    <FormGroup>
      {label && <Label>{label}</Label>}
      <IdfSimpleSearch
        data={dataLocations}
        startSearch={2}
        onChange={onGetDirection}
        onKeyDown={onKeyDown}
        notFoundMessage="Address not found"
        onHandleSelect={(e, item) => {
          fieldInFields(e, item);
        }}
        value={!addActivity ? value?.address_street : value}
        as="div"
        id="search-direction"
        {...restProps}
      />
    </FormGroup>
  );
};

export default IdfSearchDirections;
