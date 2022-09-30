import { setDateFormatUTC } from '../../utils/Utils';
import IdfDatePicker from '../idfComponents/idfDateTime/IdfDatePicker';
import IdfTimePicker from '../idfComponents/idfDateTime/IfdTimePicker';
import IdfFormInput from '../idfComponents/idfFormInput/IdfFormInput';
import IdfTextArea from '../idfComponents/idfFormInput/IdfTextArea';

export const VIEW_CARD = 'card';
export const VIEW_CUSTOM = 'custom';
export const VIEW_FORM = 'form';

export const dataInit = {
  name: '',
  type: {},
};

export const reducer = (state = [], { type, payload }) => {
  switch (type) {
    case 'create': {
      return payload;
    }
    case 'save': {
      return [...state, payload];
    }
    case 'edit': {
      const temp = [...state];
      const { index, data } = payload;
      temp[index] = data;

      return temp;
    }
    case 'delete': {
      const clone = [...state];
      clone.splice(payload, 1);

      return clone;
    }
    default:
      return state;
  }
};

export const iconByTypeField = (type) => {
  switch (type) {
    case 'CHAR': {
      return {
        name: 'Text',
        description: 'Text field is used to store texts up to 255 characters',
        field_type: 'CHAR',
        value_type: 'string',
        icon: 'text_rotation_none',
      };
    }
    case 'TEXT': {
      return {
        name: 'Text Long',
        description:
          'Long text field is used to store texts longer than usual.',
        field_type: 'TEXT',
        value_type: 'string',
        icon: 'text_fields',
      };
    }
    case 'NUMBER': {
      return {
        name: 'Numeric',
        description:
          'Number field is used to store data such as amount of commission or other custom numerical data.',
        field_type: 'NUMBER',
        icon: 'numbers',
        value_type: 'number',
      };
    }
    case 'TIME': {
      return {
        name: 'Time',
        description: 'Time field is used to store times.',
        field_type: 'TIME',
        value_type: 'date',
        icon: 'today',
      };
    }
    case 'DATE': {
      return {
        name: 'Date',
        description: 'Date field is used to store dates.',
        field_type: 'DATE',
        value_type: 'date',
        icon: 'access_time',
      };
    }
    default:
      return {
        name: 'Date',
        description: 'Date field is used to store dates.',
        field_type: 'DATE',
        value_type: 'date',
        icon: 'access_time',
      };
  }
};

export const renderValueField = (type, value) => {
  switch (type) {
    case 'TIME': {
      return setDateFormatUTC(value, 'hh:mm A');
    }
    case 'DATE': {
      return setDateFormatUTC(value, 'YYYY-MM-DD');
    }
    default:
      return value;
  }
};

export const renderComponent = (type) => {
  switch (type) {
    case 'TIME': {
      return <IdfTimePicker />;
    }
    case 'DATE': {
      return <IdfDatePicker />;
    }
    case 'TEXT': {
      return <IdfTextArea />;
    }
    default:
      return <IdfFormInput />;
  }
};
