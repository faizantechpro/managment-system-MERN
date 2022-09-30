import axios from 'axios';

import groupsService from '../../services/groups.service';

jest.mock('axios');
const API_URL = '/api/groups';

describe('Test groupsService', () => {
  const respond = { data: {} };
  const defaultPagination = { page: 1, limit: 10 };

  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('Method getGroups should respond successfully', async () => {
    axios.get.mockResolvedValueOnce(respond);

    const result = await groupsService.getGroups(null, defaultPagination);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}`, {
      params: defaultPagination,
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method getGroups should return an error message', async () => {
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    const result = await groupsService.getGroups(null, defaultPagination);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}`, {
      params: defaultPagination,
      headers: {},
    });
    expect(result).toEqual(error);
  });

  it('Method CreateGroup should respond successfully', async () => {
    axios.post.mockResolvedValueOnce(respond);
    const newGroup = {
      name: 'New Group',
      parent_id: 1,
    };
    const result = await groupsService.CreateGroup(newGroup);

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, newGroup, {
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method CreateGroup should return an error message', async () => {
    const error = new Error('Network Error');
    axios.post.mockRejectedValueOnce(error);
    const newGroup = {
      name: 'New Group',
      parent_id: 1,
    };
    const result = await groupsService.CreateGroup(newGroup);

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}`, newGroup, {
      headers: {},
    });
    expect(result).toEqual(error);
  });

  it('Method getGroupById should respond successfully', async () => {
    const group_id = 1;
    axios.get.mockResolvedValueOnce(respond);
    const result = await groupsService.getGroupById(group_id);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${group_id}`, {
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method getGroupById should return an error message', async () => {
    const group_id = 1;
    const error = new Error('Network Error');
    axios.get.mockRejectedValueOnce(error);

    const result = await groupsService.getGroupById(group_id);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${group_id}`, {
      headers: {},
    });
    expect(result).toEqual(error);
  });

  it('Method updateGroup should respond successfully', async () => {
    axios.put.mockResolvedValueOnce(respond);
    const data = {
      id: 1,
      name: 'New Group',
      parent_id: 2,
    };

    const result = await groupsService.updateGroup(data);

    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/${data.id}`, data, {
      headers: {},
    });
    expect(result).toEqual({});
  });

  it('Method updateGroup should return an error message', async () => {
    const error = new Error('Network Error');
    axios.put.mockRejectedValueOnce(error);
    const data = {
      id: 1,
      name: 'New Group',
      parent_id: 2,
    };

    const result = await groupsService.updateGroup(data);

    expect(axios.put).toHaveBeenCalledWith(`${API_URL}/${data.id}`, data, {
      headers: {},
    });
    expect(result).toEqual(error);
  });
});
