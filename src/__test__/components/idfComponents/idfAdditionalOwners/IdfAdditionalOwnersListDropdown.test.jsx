import { fireEvent, render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import IdfAdditionalOwnersListDropdown from '../../../../components/idfComponents/idfAdditionalOwners/IdfAdditionalOwnersListDropdown';
import organizationService from '../../../../services/organization.service';
import {
  dataGetOneOwners,
  dataGetThreeOwners,
} from '../../../__mocks__/services/organization.service';

jest.mock('../../../../services/organization.service');

describe('Test IdfAdditionalOwnersListDropdown', () => {
  const props = {
    defaultSize: 'xs',
    service: organizationService,
    maxOwners: 3,
    serviceId: '1',
    mainOwner: {
      id: 1,
      first_name: 'First Name',
      last_name: 'Last Name',
      title: 'Title',
    },
  };
  const history = createMemoryHistory();

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();

    await organizationService.getOwners.mockImplementation(() =>
      Promise.resolve(dataGetOneOwners)
    );
  });

  it('Snapshot component without dropdown menu', async () => {
    const component = render(
      <Router history={history}>
        <IdfAdditionalOwnersListDropdown {...props} />
      </Router>
    );

    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('Snapshot component with dropdown menu', async () => {
    const component = render(
      <Router history={history}>
        <IdfAdditionalOwnersListDropdown {...props} />
      </Router>
    );

    const buttonAdd = component.getByText('add');
    fireEvent.click(buttonAdd);

    await screen.findByText(/Owner/i);

    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it("Should render button 'View All'", async () => {
    await organizationService.getOwners.mockImplementation(() =>
      Promise.resolve(dataGetThreeOwners)
    );

    const component = render(
      <Router history={history}>
        <IdfAdditionalOwnersListDropdown {...props} maxCount={2} />
      </Router>
    );

    const buttonAdd = component.getByText('add');
    fireEvent.click(buttonAdd);

    await screen.findAllByText(/Owner/i);
    const buttonView = component.getByText('View all');

    await waitFor(() => {
      expect(buttonView).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
