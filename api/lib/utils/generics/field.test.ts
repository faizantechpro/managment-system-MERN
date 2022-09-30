import { fieldMappings, FieldType } from './field';

describe('biz/generics/field', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  it('should successfully validate DATE strings', () => {
    let dateValue;

    const dateField = fieldMappings[FieldType.DATE];

    dateValue = new Date().toISOString();
    expect(dateField.isValid(dateValue)).toEqual(true);

    dateValue = 'invalid date';
    expect(dateField.isValid(dateValue)).toEqual(false);

    dateValue = '2011-10-10T14:48:00';
    expect(dateField.isValid(dateValue)).toEqual(true);
  });

  it('should successfully validate TIME strings', () => {
    let timeValue;

    const timeField = fieldMappings[FieldType.TIME];

    timeValue = '00:00:00';
    expect(timeField.isValid(timeValue)).toEqual(true);
    timeValue = '23:59:59';
    expect(timeField.isValid(timeValue)).toEqual(true);
    timeValue = '12:59:59';
    expect(timeField.isValid(timeValue)).toEqual(true);
    timeValue = '12:59:59 PM'; // PM
    expect(timeField.isValid(timeValue)).toEqual(true);
    timeValue = '12:59:59 AM'; // AM
    expect(timeField.isValid(timeValue)).toEqual(true);
    timeValue = '12:59:59 pm'; // lower cased
    expect(timeField.isValid(timeValue)).toEqual(true);

    timeValue = '12:59:59 ZZ'; // invalid
    expect(timeField.isValid(timeValue)).toEqual(false);
    timeValue = '12:60:60';
    expect(timeField.isValid(timeValue)).toEqual(false);
    timeValue = '24:00:00';
    expect(timeField.isValid(timeValue)).toEqual(false);
  });
});
