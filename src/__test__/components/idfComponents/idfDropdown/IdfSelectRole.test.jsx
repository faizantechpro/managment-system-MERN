import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';

import IdfSelectRole from '../../../../components/idfComponents/idfDropdown/IdfSelectRole';
import { GetRolesMock } from '../../../__mocks__/services/role.services';
import roleService from '../../../../services/role.service';

jest.mock('axios');

describe('IdfSelectRole', () => {
  const id = 'selectRoleDropdown';
  const onChange = jest.fn();
  const value = { search: '' };
  const errorsRedirectHandler = jest.fn();

  const filterTestFn = jest
    .fn()
    .mockImplementation((role) => role.name.toLowerCase().includes('admin'));
  filterTestFn.mockReturnValueOnce(true);

  const filteredDataMock = GetRolesMock?.data.filter((item) =>
    filterTestFn(item)
  );

  beforeEach(async () => {
    const setRoleDataMock = jest.fn();
    const roleDataMock = (roleData) => [roleData, setRoleDataMock];
    jest.spyOn(React, 'useState').mockImplementation(roleDataMock);

    axios.get.mockImplementation(() => Promise.resolve(GetRolesMock?.data));
  });

  it('Snapshot', async () => {
    await waitFor(() => expect(filteredDataMock).toEqual(GetRolesMock?.data));

    const { container } = render(
      <IdfSelectRole id={id} onChange={onChange} value={value} />
    );

    container.filteredData = filteredDataMock;
    await waitFor(() => expect(container).toMatchSnapshot());
  });

  it('Should have a request to roles', async () => {
    expect(axios.get).not.toHaveBeenCalled();

    await roleService.GetRoles().catch((err) => errorsRedirectHandler(err));

    expect(axios.get).toHaveBeenCalled();
  });

  it('Should have a filter with correct data', () => {
    GetRolesMock?.data.filter((item) => {
      const role = item.name
        .toLowerCase()
        .includes(GetRolesMock?.data[0].name.toLowerCase());

      return waitFor(() => expect(role).toBeTruthy());
    });
  });

  it('Should show a label if exist label', () => {
    const label = 'Role section';

    const { container } = render(
      <IdfSelectRole id={id} onChange={onChange} value={value} label={label} />
    );

    const labelTag = container.querySelector('label');

    expect(labelTag).toBeTruthy();
  });

  it('Should not show a label and show a dropdown only', async () => {
    const { container } = render(
      <IdfSelectRole id={id} onChange={onChange} value={value} />
    );

    const dropdownComponent = container.querySelector(
      '#dropdown-selectRoleDropdown'
    );

    await waitFor(() => expect(dropdownComponent).toBeTruthy());

    const labelTitle = container.querySelector('label');

    await waitFor(() => expect(labelTitle).toBeNull());

    expect(labelTitle).not.toBeInTheDocument();
  });

  it('Should have a button with text Search for Category', async () => {
    const { container } = render(
      <IdfSelectRole id={id} onChange={onChange} value={value} />
    );

    const dropdownComponent = container.querySelector(
      '#dropdown-selectRoleDropdown'
    );

    await waitFor(() =>
      expect(dropdownComponent).toHaveTextContent('Search for Role')
    );
  });
});
