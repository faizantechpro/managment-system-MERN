import { fireEvent, render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import IdfPrincipalOwnerAvatar from '../../../../components/idfComponents/idfAdditionalOwners/IdfPrincipalOwnerAvatar';
import { usersProfile } from '../../../../utils/routes.json';

describe('Test IdfPrincipalOwnerAvatar', () => {
  const props = {
    withoutRequest: true,
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
  });

  it('Snapshot and render showing the initials of the name', () => {
    const component = render(
      <Router history={history}>
        <IdfPrincipalOwnerAvatar {...props} />
      </Router>
    );
    expect(component.container).toBeVisible();
    expect(component.container).toHaveTextContent('FL');
    expect(component.baseElement).toMatchSnapshot();
  });

  it("Shouldn't allow other initials differents to the name", () => {
    const { container } = render(
      <Router history={history}>
        <IdfPrincipalOwnerAvatar {...props} />
      </Router>
    );
    expect(container).toBeVisible();
    expect(container).not.toHaveTextContent('NA');
  });

  it('Should render the avatar with the default size', () => {
    const size = 'sm';
    const { container } = render(
      <Router history={history}>
        <IdfPrincipalOwnerAvatar {...props} />
      </Router>
    );

    const avatar = container.getElementsByClassName(`avatar-${size}`)[0];

    expect(avatar).toBeVisible();
    expect(avatar).toHaveClass(`avatar-${size}`);
  });

  it('Should render the avatar with the size xs', () => {
    const size = 'xs';
    const { container } = render(
      <Router history={history}>
        <IdfPrincipalOwnerAvatar {...props} defaultSize={size} />
      </Router>
    );

    const avatar = container.getElementsByClassName(`avatar-${size}`)[0];

    expect(avatar).toBeVisible();
    expect(avatar).toHaveClass(`avatar-${size}`);
    expect(avatar).not.toHaveClass(`avatar-sm`);
  });

  it('Should render the tooltip when the mouse is over component', async () => {
    const { mainOwner } = props;
    const firstText = `${mainOwner.first_name} ${mainOwner.last_name} - ${mainOwner.title}`;
    const component = render(
      <Router history={history}>
        <IdfPrincipalOwnerAvatar {...props} />
      </Router>
    );

    const span = component.getByText('FL');
    fireEvent.mouseOver(span);

    const tool = component.getByText(firstText);

    await waitFor(() => {
      expect(tool).toBeVisible();
      expect(tool).toHaveTextContent(firstText);
    });
  });

  it('Should call the link when click the component', async () => {
    const { mainOwner } = props;
    history.push = jest.fn();

    const component = render(
      <Router history={history}>
        <IdfPrincipalOwnerAvatar {...props} />
      </Router>
    );

    const link = component.container.querySelector(`.main-owner > a`);
    fireEvent.click(link);

    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith(
      `${usersProfile}/${mainOwner.id}`
    );
  });
});
