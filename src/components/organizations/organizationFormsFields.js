import { FormGroup, Label } from 'reactstrap';

import IdfFormInput from '../idfComponents/idfFormInput/IdfFormInput';
import IdfSearchDirections from '../idfComponents/idfSearch/IdfSearchDirections';

import {
  CITY,
  LABEL,
  NAME_LABEL,
  OWNER,
  STATE,
  STREET,
  ZIP_CODE,
} from '../../utils/constants';
import IdfSelectState from '../idfComponents/idfDropdown/IdfSelectState';
import IdfSelectLabel from '../idfComponents/idfDropdown/IdfSelectLabel';
import IdfSelectIndustry from '../idfComponents/idfDropdown/IdfSelectIndustry';
import IdfOwnersHeader from '../idfComponents/idfAdditionalOwners/IdfOwnersHeader';

const Assigned = (props) => {
  return (
    <FormGroup>
      <Label>{OWNER}</Label>
      <IdfOwnersHeader {...props} />
    </FormGroup>
  );
};

export const organizationFormFields = [
  {
    id: 'name',
    name: 'name',
    label: NAME_LABEL,
    placeholder: NAME_LABEL,
    component: <IdfFormInput />,
    colSize: 12,
  },
  {
    id: 'address_street',
    name: 'address_street',
    label: 'Address',
    placeholder: 'Address',
    component: <IdfSearchDirections fromNavBar />,
    colSize: 12,
  },
  {
    id: 'label_id',
    name: 'label_id',
    label: LABEL,
    placeholder: LABEL,
    type: 'organization',
    component: <IdfSelectLabel />,
    colSize: 12,
  },
  {
    id: 'assigned_user_id',
    name: 'assigned_user_id',
    label: OWNER,
    placeholder: STREET,
    component: <Assigned isClickable={false} allowDelete={true} />,
    colSize: 12,
    showAvatar: true,
  },
];

export const organizationFormFieldsOverview = [
  {
    id: 'name',
    name: 'name',
    label: NAME_LABEL,
    placeholder: NAME_LABEL,
    component: <IdfFormInput />,
    colSize: 12,
  },
  {
    id: 'label_id',
    name: 'label_id',
    label: 'Label',
    type: 'organization',
    placeholder: NAME_LABEL,
    component: <IdfSelectLabel />,
    colSize: 12,
    isRefresh: false,
    bulletPoints: true,
  },
  {
    id: 'address_street',
    name: 'address_street',
    label: STREET,
    placeholder: STREET,
    component: <IdfSearchDirections />,
    colSize: 12,
  },
  {
    id: 'address_city',
    name: 'address_city',
    label: CITY,
    placeholder: CITY,
    component: <IdfFormInput />,
    colSize: 12,
  },
  {
    id: 'address_state',
    name: 'address_state',
    label: STATE,
    placeholder: STATE,
    component: <IdfSelectState />,
    colSize: 12,
  },
  {
    id: 'address_postalcode',
    name: 'address_postalcode',
    label: ZIP_CODE,
    placeholder: ZIP_CODE,
    component: <IdfFormInput />,
    colSize: 12,
  },
  {
    id: 'phone',
    name: 'phone_office',
    label: 'Phone',
    placeholder: 'Phone',
    component: <IdfFormInput />,
    colSize: 12,
  },
  {
    id: 'industry',
    name: 'industry',
    label: 'Industry',
    placeholder: 'Industry',
    component: <IdfSelectIndustry />,
    colSize: 12,
  },
  {
    type: 'number',
    id: 'employees',
    name: 'employees',
    label: 'Employees',
    placeholder: 'Employees',
    component: <IdfFormInput />,
    colSize: 12,
    max: 99999999,
  },
  {
    type: 'number',
    id: 'annual_revenue',
    name: 'annual_revenue',
    label: 'Annual Revenue',
    placeholder: 'Annual Revenue',
    component: <IdfFormInput />,
    colSize: 12,
    max: 9999999999,
  },
];
