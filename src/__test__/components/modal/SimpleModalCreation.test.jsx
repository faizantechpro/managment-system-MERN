import { render, screen } from '@testing-library/react';

import SimpleModalCreation from '../../../components/modal/SimpleModalCreation';

describe('SimpleModalCreation', () => {
  const open = true;
  const modalTitle = 'Modal Test';
  const onHandleCloseModal = jest.fn();
  const handleSubmit = jest.fn();

  const children = <div>From test</div>;

  test('snapshot', () => {
    const { baseElement } = render(
      <SimpleModalCreation open={open} modalTitle={modalTitle}>
        {children}
      </SimpleModalCreation>
    );

    expect(baseElement).toMatchSnapshot();
  });

  test('Should we can to see a modal', () => {
    const { baseElement } = render(
      <SimpleModalCreation open={open} modalTitle={modalTitle}>
        {children}
      </SimpleModalCreation>
    );

    const modalClasses = baseElement.getElementsByClassName('modal-dialog');

    expect(modalClasses).toHaveLength(1);

    const modalContentClasses =
      baseElement.getElementsByClassName('modal-content');

    expect(modalContentClasses).toHaveLength(1);
  });

  test('Should we can to see a title', () => {
    const component = render(
      <SimpleModalCreation open={open} modalTitle={modalTitle}>
        {children}
      </SimpleModalCreation>
    );

    const titleTag = component.getByText(modalTitle);

    expect(titleTag).toBeTruthy();
  });

  test('Should have 1 child', () => {
    const { baseElement } = render(
      <SimpleModalCreation open={open} modalTitle={modalTitle}>
        {children}
      </SimpleModalCreation>
    );

    const child = baseElement.getElementsByClassName('modal-body')[0];

    expect(child.childElementCount).toEqual(1);
  });

  test('Should have a footer and buttons', () => {
    render(
      <SimpleModalCreation
        open={open}
        modalTitle={modalTitle}
        onHandleCloseModal={onHandleCloseModal}
        handleSubmit={handleSubmit}
      >
        {children}
      </SimpleModalCreation>
    );

    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeTruthy();

    const saveButton = screen.getByText('Save');

    expect(saveButton).toBeTruthy();
  });

  test('Should show an update button', () => {
    render(
      <SimpleModalCreation
        open={open}
        modalTitle={modalTitle}
        onHandleCloseModal={onHandleCloseModal}
        handleSubmit={handleSubmit}
        editFields={true}
      >
        {children}
      </SimpleModalCreation>
    );

    const updateButton = screen.getByText('Update');

    expect(updateButton).toBeTruthy();
  });

  test('Should show a spinner when we have loading', () => {
    const { baseElement } = render(
      <SimpleModalCreation
        open={open}
        modalTitle={modalTitle}
        onHandleCloseModal={onHandleCloseModal}
        handleSubmit={handleSubmit}
        isLoading={true}
      >
        {children}
      </SimpleModalCreation>
    );

    const loading = baseElement.getElementsByClassName('spinner-border');

    expect(loading).toHaveLength(1);
  });
});
