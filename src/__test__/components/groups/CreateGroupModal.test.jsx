import { fireEvent, render } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';

import CreateGroupModal from '../../../components/groups/CreateGroupModal';
import stringConstants from '../../../utils/stringConstants.json';

describe('Test CreateGroupModal', () => {
  const constants = stringConstants.settings.groups;
  const props = {
    showModal: true,
    data: [
      { id: 1, name: 'Group 1' },
      { id: 2, name: 'Group 2' },
      { id: 3, name: 'Group 3' },
    ],
  };

  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('Snapshot', () => {
    const component = render(<CreateGroupModal {...props} />);
    expect(component.container).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();
  });

  it('Snapshot with dropdown menu open', async () => {
    const component = render(<CreateGroupModal {...props} />);

    const buttonDropdown = component.getByText(
      constants.create.dropTextParentGroup
    );
    fireEvent.click(buttonDropdown);

    await waitFor(() => {
      expect(buttonDropdown).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('Should call prop setShowModal when try close modal', async () => {
    const mockCloseHandler = jest.fn();
    const component = render(
      <CreateGroupModal {...props} setShowModal={mockCloseHandler} />
    );

    const iconClose = document.getElementsByClassName('close')[0];
    fireEvent.click(iconClose);

    await waitFor(() => {
      expect(iconClose).toBeVisible();
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });

    const buttonClose = component.getByText('Cancel');
    fireEvent.click(buttonClose);

    await waitFor(() => {
      expect(buttonClose).toBeVisible();
      expect(mockCloseHandler).toHaveBeenCalledTimes(2);
    });
  });

  it('Should call prop onChangeDrop when writes in the input from dropdown', async () => {
    const mockOnChangeDrop = jest.fn();
    const component = render(
      <CreateGroupModal {...props} onChangeDrop={mockOnChangeDrop} />
    );

    const buttonDropdown = component.getByText(
      constants.create.dropTextParentGroup
    );
    fireEvent.click(buttonDropdown);

    const dropdownMenu = document.getElementsByClassName('dropdown-menu')[0];
    const inputMenu = dropdownMenu.getElementsByClassName('form-control')[0];

    fireEvent.change(inputMenu, { target: { value: 'Group' } });

    await waitFor(() => {
      expect(dropdownMenu).toBeVisible();
      expect(inputMenu).toBeVisible();
      expect(mockOnChangeDrop).toHaveBeenCalledTimes(1);
    });
  });

  it('Should allow select an item from dropdown', async () => {
    const component = render(<CreateGroupModal {...props} />);

    const buttonDropdown = component.getByText(
      constants.create.dropTextParentGroup
    );
    fireEvent.click(buttonDropdown);

    const firstItem = component.getByText(props.data[0].name);
    fireEvent.click(firstItem);

    await waitFor(() => {
      expect(buttonDropdown).toBeVisible();
      expect(buttonDropdown).toHaveTextContent(props.data[0].name);
    });
  });

  it('Should call prop createGroup when it has the items selected', async () => {
    const mockCreateGroup = jest.fn();
    const mockCloseHandler = jest.fn();
    const component = render(
      <CreateGroupModal
        {...props}
        createGroup={mockCreateGroup}
        setShowModal={mockCloseHandler}
      />
    );

    const buttonDropdown = component.getByText(
      constants.create.dropTextParentGroup
    );
    fireEvent.click(buttonDropdown);

    const firstItem = component.getByText(props.data[0].name);
    fireEvent.click(firstItem);

    const inputGroup = component.getByTestId('group_name');
    fireEvent.change(inputGroup, { target: { value: 'New group' } });

    await waitFor(() => {
      expect(buttonDropdown).toHaveTextContent(props.data[0].name);
      expect(inputGroup.value).toContain('New group');
    });

    const buttonCreate = component.getByText(constants.create.btnAddGroup);
    fireEvent.click(buttonCreate);

    await waitFor(() => {
      expect(mockCreateGroup).toHaveBeenCalledTimes(1);
      expect(mockCloseHandler).toHaveBeenCalledTimes(1);
    });
  });
});
