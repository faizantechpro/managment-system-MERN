import { fireEvent, render, screen } from '@testing-library/react';
import { waitFor } from '@testing-library/dom';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import moment from 'moment';

import Activity from '../../../components/steps/Activity';
import userService from '../../../services/user.service';
import feedService from '../../../services/feed.service';
import { ACTIVITY_FEED_THEMES } from '../../../utils/constants';
import {
  dataGetGuest,
  dataGetThreeGuest,
} from '../../__mocks__/services/user.service';

jest.mock('../../../services/user.service');
jest.mock('../../../services/feed.service');

describe('Test Actitivy', () => {
  const history = createMemoryHistory();

  const props = {
    data: {
      id: 'data_id_1',
      start_date: '2022-03-09T13:15:00.000Z',
      feed: {
        id: 'feed_id_1',
        summary: 'Activity added',
        type: 'meetingActivity',
      },
      guests: 'guest_id_1',
      done: false,
      name: 'test meet',
      location: 'Meet',
      conference_link: '',
      type: 'callActivity',
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();

    userService.getGuestsByIds.mockImplementation(() => Promise.resolve([]));
    feedService.updateActivity.mockImplementation(() => Promise.resolve({}));
  });

  it('Snapshot component', async () => {
    const component = render(<Activity {...props} />);
    await waitFor(() => {
      expect(component.container).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('Should render icon call', async () => {
    props.data.type = 'callActivity';
    const component = render(<Activity {...props} />);
    const icon = component.getByText('call');
    await waitFor(() => {
      expect(icon).toEqual(
        component.getByText(ACTIVITY_FEED_THEMES[props.data.type].icon)
      );
    });
  });

  it('Should render icon meeting', async () => {
    props.data.type = 'meetingActivity';
    const component = render(<Activity {...props} />);
    const icon = component.getByText('groups');
    await waitFor(() => {
      expect(icon).toEqual(
        component.getByText(ACTIVITY_FEED_THEMES[props.data.type].icon)
      );
    });
  });

  it('Should render icon task', async () => {
    props.data.type = 'taskActivity';
    const component = render(<Activity {...props} />);
    const icon = component.getByText('schedule');
    await waitFor(() => {
      expect(icon).toEqual(
        component.getByText(ACTIVITY_FEED_THEMES[props.data.type].icon)
      );
    });
  });

  it('Should render icon deadline', async () => {
    props.data.type = 'deadlineActivity';
    const component = render(<Activity {...props} />);
    const icon = component.getByText('flag');
    await waitFor(() => {
      expect(icon).toEqual(
        component.getByText(ACTIVITY_FEED_THEMES[props.data.type].icon)
      );
    });
  });

  it('Should render icon email', async () => {
    props.data.type = 'emailActivity';
    const component = render(<Activity {...props} />);
    const icon = component.getByText('email');
    await waitFor(() => {
      expect(icon).toEqual(
        component.getByText(ACTIVITY_FEED_THEMES[props.data.type].icon)
      );
    });
  });

  it('Should render icon lunch', async () => {
    props.data.type = 'lunchActivity';
    const component = render(<Activity {...props} />);
    const icon = component.getByText('restaurant_menu');
    await waitFor(() => {
      expect(icon).toEqual(
        component.getByText(ACTIVITY_FEED_THEMES[props.data.type].icon)
      );
    });
  });

  it('Should render with the format correct', async () => {
    const format = 'MMM DD YYYY h:mm A';
    const component = render(<Activity {...props} />);
    const date = component.getByTestId(`li-item-date-${props.data.id}`);

    await waitFor(() => {
      expect(date).toEqual(
        component.getByText(moment(props.data.start_date).utc().format(format))
      );
    });
  });

  it('Should show the conference link if the data dont have location', async () => {
    props.data.location = '';
    props.data.conference_link = 'conference link';
    const component = render(<Activity {...props} />);

    await waitFor(() => {
      expect(component.baseElement).toHaveTextContent(
        props.data.conference_link
      );
    });
  });

  it('Should call prop confirm at least once', async () => {
    const mockConfirm = jest.fn();
    const component = render(<Activity {...props} confirm={mockConfirm} />);
    const input = component.getByTestId(`checkbox-${props.data.id}`);
    fireEvent.click(input);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('Snapshot component with guest rendered', async () => {
    userService.getGuestsByIds.mockImplementation(() =>
      Promise.resolve(dataGetGuest)
    );

    const component = render(
      <Router history={history}>
        <Activity {...props} />
      </Router>
    );
    const initials = `${dataGetGuest.data.users[0].first_name[0]}${dataGetGuest.data.users[0].last_name[0]}`;
    await screen.findByText(initials);

    await waitFor(() => {
      expect(component.baseElement).toHaveTextContent(initials);
      expect(component.baseElement).toMatchSnapshot();
    });
  });

  it('Snapshot component with guests and icon add', async () => {
    userService.getGuestsByIds.mockImplementation(() =>
      Promise.resolve(dataGetThreeGuest)
    );

    const component = render(
      <Router history={history}>
        <Activity {...props} maxUsers={2} />
      </Router>
    );
    const initials = `${dataGetThreeGuest.data.users[0].first_name[0]}${dataGetThreeGuest.data.users[0].last_name[0]}`;
    await screen.findByText(initials);
    const iconAdd = component.getByText('add');

    await waitFor(() => {
      expect(iconAdd).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
