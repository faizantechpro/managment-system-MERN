import { fireEvent, render, waitFor } from '@testing-library/react';

import IdfDropdownSearch from '../../../../components/idfComponents/idfDropdown/IdfDropdownSearch';

describe('IdfDropdownSearch', () => {
  const id = 'category';
  const title = 'Search for Category';
  const data = [
    {
      id: 9,
      title: 'Identifee 1',
      description: 'Identifee',
      createdAt: '2021-07-18T04:48:19.365Z',
      updatedAt: '2022-02-14T18:29:19.827Z',
    },
  ];
  const customTitle = '';
  const onHandleSelect = jest.fn().mockImplementation(() => {});
  let value = '';
  const onChange = jest.fn().mockImplementation(() => {});
  const showAvatar = false;
  const bulletPoints = false;
  const className = '';

  it('Snapshot', () => {
    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should have a button with text Search for Category', async () => {
    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    const dropdownComponent = container.querySelector('#dropdown-category');

    await waitFor(() =>
      expect(dropdownComponent).toHaveTextContent('Search for Category')
    );
  });

  it('Should to be able to click on the toggle button', async () => {
    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    const dropdownComponent = container.querySelector(
      `#dropdown-${id} > button`
    );

    fireEvent.click(dropdownComponent);

    const menu = container.getElementsByClassName(
      'basic-animation border border-1 overflow-auto w-100'
    )[0];

    waitFor(() => expect(menu).toBeVisible());
  });

  it('Should to be able to write on the input', async () => {
    value = 'some text';

    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    const dropdownComponent = container.querySelector(
      `#dropdown-${id} > button`
    );

    fireEvent.click(dropdownComponent);

    const menu = container.getElementsByClassName(
      'basic-animation border border-1 overflow-auto w-100'
    )[0];

    waitFor(() => expect(menu).toBeVisible());

    const search = menu.querySelector('div > input');

    fireEvent.change(search, { target: { value } });

    expect(search).toHaveValue(value);
  });

  it('Should not to be able to close dropdown when click on the input', async () => {
    value = 'some text';

    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    const dropdownComponent = container.querySelector(
      `#dropdown-${id} > button`
    );

    fireEvent.click(dropdownComponent);

    const menu = container.getElementsByClassName(
      'basic-animation border border-1 overflow-auto w-100'
    )[0];

    waitFor(() => expect(menu).toBeVisible());

    const search = menu.querySelector('div > input');

    const isPrevented = fireEvent.click(search);

    expect(isPrevented).toBe(true);
  });

  it('Should to be able to select an item', async () => {
    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    const dropdownComponent = container.querySelector(
      `#dropdown-${id} > button`
    );

    fireEvent.click(dropdownComponent);

    const menu = container.getElementsByClassName(
      'basic-animation border border-1 overflow-auto w-100'
    )[0];

    await waitFor(() => expect(menu).toBeVisible());

    const item = menu.querySelector('div > div > a');

    fireEvent.click(item);

    await waitFor(() => expect(onHandleSelect).toHaveBeenCalledTimes(1));
  });

  it('Should to be able to see a bullet point in the menu', async () => {
    const bulletPoints = true;

    const { container } = render(
      <IdfDropdownSearch
        id={id}
        title={title}
        data={data}
        customTitle={customTitle}
        onHandleSelect={onHandleSelect}
        value={value}
        onChange={onChange}
        showAvatar={showAvatar}
        bulletPoints={bulletPoints}
        className={className}
      />
    );

    const dropdownComponent = container.querySelector(
      `#dropdown-${id} > button`
    );

    fireEvent.click(dropdownComponent);

    const menu = container.getElementsByClassName(
      'basic-animation border border-1 overflow-auto w-100'
    )[0];

    await waitFor(() => expect(menu).toBeVisible());

    const item = menu.querySelector('div > div > a');

    const bullet = item.getElementsByClassName(
      'ml-3 rounded-circle bullet-color'
    )[0];

    expect(bullet).toBeVisible();
  });
});
