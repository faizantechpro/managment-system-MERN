import axios from 'axios';

import insightsService from '../../services/insights.service';

const API_URL = '/api/insights';
jest.mock('axios');

describe('Test insightsService', () => {
  const respond = { data: {} };

  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('Method getDashboards should respond successfully', async () => {
    axios.get.mockResolvedValueOnce(respond);
    const result = await insightsService.getDashboards();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/dashboards`, {
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method getDashboards should return an error message', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    const result = await insightsService.getDashboards();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/dashboards`, {
      headers: {},
    });
    expect(result).toEqual(error);
  });

  it('Method addDashboard should respond successfully', async () => {
    const newDashboard = { name: 'New Dashboard' };
    axios.post.mockResolvedValueOnce(respond);
    const result = await insightsService.addDashboard(newDashboard);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/dashboards`,
      newDashboard,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method addDashboard should return an error message', async () => {
    const newDashboard = { name: 'New Dashboard' };
    const error = new Error('Network Error');
    axios.post.mockRejectedValueOnce(error);

    const result = await insightsService.addDashboard(newDashboard);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/dashboards`,
      newDashboard,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method shareDashboard should respond successfully', async () => {
    axios.post.mockResolvedValueOnce(respond);
    const share = {
      users: {},
      dashboard: {},
    };
    const result = await insightsService.shareDashboard(share);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/dashboard/share`,
      share,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method shareDashboard should return an error message', async () => {
    const error = new Error('Network Error');
    axios.post.mockRejectedValueOnce(error);
    const share = {
      users: {},
      dashboard: {},
    };

    const result = await insightsService.shareDashboard(share);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/dashboard/share`,
      share,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method getReports should respond successfully', async () => {
    axios.get.mockResolvedValueOnce(respond);
    const result = await insightsService.getReports();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/reports`, {
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method getReports should return an error message', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    const result = await insightsService.getReports();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/reports`, {
      headers: {},
    });
    expect(result).toEqual(error);
  });

  it('Method addReportToDashboard should respond successfully', async () => {
    axios.post.mockResolvedValueOnce(respond);
    const newDashboard = {
      report_id: 1,
      dashboard_id: 2,
      position: 0,
    };
    const result = await insightsService.addReportToDashboard(newDashboard);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/dashboard/report`,
      newDashboard,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method addReportToDashboard should return an error message', async () => {
    const error = new Error('Network Error');
    axios.post.mockRejectedValueOnce(error);
    const newDashboard = {
      report_id: 1,
      dashboard_id: 2,
      position: 0,
    };

    const result = await insightsService.addReportToDashboard(newDashboard);

    expect(axios.post).toHaveBeenCalledWith(
      `${API_URL}/dashboard/report`,
      newDashboard,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method getReportsByDashboardId should respond successfully', async () => {
    axios.get.mockResolvedValueOnce(respond);
    const dashboard = { dashboard_id: 1 };

    const result = await insightsService.getReportsByDashboardId(dashboard);

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/dashboard/${dashboard.dashboard_id}/reports`,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method getReportsByDashboardId should return an error message', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);
    const dashboard = { dashboard_id: 1 };

    const result = await insightsService.getReportsByDashboardId(dashboard);

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/dashboard/${dashboard.dashboard_id}/reports`,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method updatePosition should respond successfully', async () => {
    const data = {};
    axios.put.mockResolvedValueOnce(respond);
    const result = await insightsService.updatePosition(data);

    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}/dashboard/report`,
      data,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method updatePosition should return an error message', async () => {
    const data = {};
    const error = new Error('Network Error');
    axios.put.mockRejectedValueOnce(error);

    const result = await insightsService.updatePosition(data);

    expect(axios.put).toHaveBeenCalledWith(
      `${API_URL}/dashboard/report`,
      data,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method getUsersByDashboardId should respond successfully', async () => {
    axios.get.mockResolvedValueOnce(respond);
    const dashboard = { dashboard_id: 1 };
    const result = await insightsService.getUsersByDashboardId(dashboard);

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/dashboard/${dashboard.dashboard_id}/users`,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method getUsersByDashboardId should return an error message', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    const dashboard = { dashboard_id: 1 };
    const result = await insightsService.getUsersByDashboardId(dashboard);

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}/dashboard/${dashboard.dashboard_id}/users`,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method deleteUserFromDashboard should respond successfully', async () => {
    axios.delete.mockResolvedValueOnce(respond);
    const userId = 1;
    const dashboardId = 2;

    const result = await insightsService.deleteUserFromDashboard(
      userId,
      dashboardId
    );

    expect(axios.delete).toHaveBeenCalledWith(
      `${API_URL}/dashboard/${dashboardId}/users/${userId}`,
      {
        headers: {},
      }
    );
    expect(result).toEqual({});
  });

  it('Method deleteUserFromDashboard should return an error message', async () => {
    const error = new Error('Network Error');
    axios.delete.mockRejectedValueOnce(error);

    const userId = 1;
    const dashboardId = 2;

    const result = await insightsService.deleteUserFromDashboard(
      userId,
      dashboardId
    );

    expect(axios.delete).toHaveBeenCalledWith(
      `${API_URL}/dashboard/${dashboardId}/users/${userId}`,
      {
        headers: {},
      }
    );
    expect(result).toEqual(error);
  });

  it('Method getDashboardsByRepId should respond successfully', async () => {
    const report_id = 1;
    axios.get.mockResolvedValueOnce(respond);
    const result = await insightsService.getDashboardsByRepId(report_id);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/report/${report_id}`, {
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method getDashboardsByRepId should return an error message', async () => {
    const report_id = 1;
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    const result = await insightsService.getDashboardsByRepId(report_id);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/report/${report_id}`, {
      headers: {},
    });
    expect(result).toEqual(error);
  });
});
