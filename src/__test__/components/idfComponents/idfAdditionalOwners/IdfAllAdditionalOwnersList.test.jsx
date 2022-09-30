import { fireEvent, render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import IdfAllAdditionalOwnersList from '../../../../components/idfComponents/idfAdditionalOwners/IdfAllAdditionalOwnersList';
import organizationService from '../../../../services/organization.service';
import { dataGetOneOwners } from '../../../__mocks__/services/organization.service';
import stringConstants from '../../../../utils/stringConstants.json';
import { ASSIGNED_OWNERS } from '../../../../utils/constants';

jest.mock('../../../../services/organization.service');
const constants = stringConstants.deals.organizations;

describe('Test IdfAllAdditionalOwnersList', () => {
  const history = createMemoryHistory();

  const props = {
    openAllOwners: true,
    service: organizationService,
    serviceId: '1',
    count: 10,
    mainOwner: {
      id: '12345678-abcd-efgj-a1bd-d953a4bc6cc5',
      first_name: 'First Name',
      last_name: 'Last Name',
      title: 'Title',
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();

    await organizationService.getOwners.mockImplementation(() =>
      Promise.resolve(dataGetOneOwners)
    );

    await organizationService.removeOwner.mockImplementation(() =>
      Promise.resolve({ data: {} })
    );
  });

  it('Snapshot', async () => {
    const component = render(
      <Router history={history}>
        <IdfAllAdditionalOwnersList {...props} />
      </Router>
    );

    await screen.findByText(dataGetOneOwners.data[0].user.title);

    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('Shouldnt render modal', async () => {
    render(
      <Router history={history}>
        <IdfAllAdditionalOwnersList {...props} openAllOwners={false} />
      </Router>
    );

    await waitFor(() => {
      expect(document.getElementsByClassName('modal-content').length).not.toBe(
        1
      );
    });
  });

  it('Should allow call setOpenAllOwners when try close modal', async () => {
    const mockHandler = jest.fn();

    const component = render(
      <Router history={history}>
        <IdfAllAdditionalOwnersList {...props} setOpenAllOwners={mockHandler} />
      </Router>
    );

    const close = component.getByTestId('close-modal');
    fireEvent.click(close);

    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  it('Should render the owners with their attributes', async () => {
    const component = render(
      <Router history={history}>
        <IdfAllAdditionalOwnersList {...props} />
      </Router>
    );

    const mainOwner = await screen.findByTestId(`item-${props.mainOwner.id}`);
    const ownerAdd = await screen.findByTestId(
      `item-${dataGetOneOwners.data[0].user_id}`
    );

    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(mainOwner).toHaveTextContent('FL');
      expect(mainOwner).toHaveTextContent(props.mainOwner.first_name);
      expect(mainOwner).toHaveTextContent(props.mainOwner.last_name);
      expect(mainOwner).toHaveTextContent(props.mainOwner.title);
      expect(ownerAdd).toHaveTextContent('OA');
      expect(ownerAdd).toHaveTextContent(
        dataGetOneOwners.data[0].user.first_name
      );
      expect(ownerAdd).toHaveTextContent(
        dataGetOneOwners.data[0].user.last_name
      );
      expect(ownerAdd).toHaveTextContent(dataGetOneOwners.data[0].user.title);
    });
  });

  it('Should allow delete the additional owner', async () => {
    const mockHandler = jest.fn();

    const component = render(
      <Router history={history}>
        <IdfAllAdditionalOwnersList {...props} setRefresOwners={mockHandler} />
      </Router>
    );

    const ownerAdd = await screen.findByTestId(
      `item-${dataGetOneOwners.data[0].user_id}`
    );

    const remove = ownerAdd.getElementsByClassName(
      'material-icons-outlined'
    )[0];
    fireEvent.click(remove);

    await organizationService.getOwners.mockImplementation(() =>
      Promise.resolve({ data: [] })
    );

    const buttonDelete = screen.getByText(constants.acceptConfirmation);
    fireEvent.click(buttonDelete);

    await screen.findByText(ASSIGNED_OWNERS);

    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(ownerAdd).not.toBeInTheDocument();
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });
});
