import { render } from '@testing-library/react';

import PublicProfileSidebar from '../../../components/publicProfilePage/PublicProfileSidebar';

describe('PublicProfileSidebar', () => {
  test('snapshot', () => {
    const { container } = render(<PublicProfileSidebar />);

    expect(container).toMatchSnapshot();
  });

  test('Should have an icon, an avatar', () => {
    const { container } = render(<PublicProfileSidebar />);

    const icon = container.getElementsByClassName(
      'material-icons-outlined text-white'
    )[0];

    expect(icon).toBeTruthy();

    const avatar = container.getElementsByClassName(
      'avatar avatar-xl avatar-circle avatar-border-dashed mr-3'
    )[0];

    expect(avatar).toBeTruthy();
  });

  test('Should have a text with userInfo name and a title', () => {
    const userInfo = {
      first_name: 'John',
      last_name: 'Doe',
      title: 'Manager',
    };

    const { container } = render(<PublicProfileSidebar userInfo={userInfo} />);

    const name = container.querySelector('h3[class="mb-2 text-white mt-3"]');

    expect(name.textContent).toBe(' John Doe ');

    const title = container.querySelector(
      'span[class="d-block text-gray-200 font-size-sm"]'
    );

    expect(title.textContent).toBe('Manager');
  });

  test('Should have a button with Schedule Call label and icon', () => {
    const { container } = render(<PublicProfileSidebar />);

    const icon = container.querySelectorAll(
      'button[class="btn btn-outline-light font-weight-medium mt-5"] > span:nth-child(1)'
    )[0];

    expect(icon.textContent).toBe('call');

    const button = container.querySelectorAll(
      'button[class="btn btn-outline-light font-weight-medium mt-5"] > span:nth-child(2)'
    )[0];

    expect(button.textContent).toBe('Schedule Call');
  });

  test('Should have a button with Your Bank Team label and icon', () => {
    const { container } = render(<PublicProfileSidebar />);

    const icon = container.querySelectorAll(
      'button[class="btn btn-outline-light font-weight-medium mt-5"] > span:nth-child(1)'
    )[1];

    expect(icon.textContent).toBe('group');

    const button = container.querySelectorAll(
      'button[class="btn btn-outline-light font-weight-medium mt-5"] > span:nth-child(2)'
    )[1];

    expect(button.textContent).toBe('Your Bank Team');
  });
});
