import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import authHeader from './auth-header';

const API_URL = '/api/feed';

class FeedService {
  getActivityFeed(
    { contactId, organizationId, dealId, userId, ...restProps },
    { page = 1, limit = 15 }
  ) {
    return axios
      .get(`${API_URL}`, {
        headers: authHeader(),
        params: {
          contactId,
          organizationId,
          dealId,
          userId,
          limit,
          page,
          ...restProps,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  createNote(note, contactId = null, organizationId = null, dealId = null) {
    return axios
      .post(
        `${API_URL}/note`,
        {
          note,
          contact_id: contactId,
          organization_id: organizationId,
          deal_id: dealId,
        },
        { headers: authHeader() }
      )
      .then((response) => {
        return response.data;
      });
  }

  updateNote(feedId, noteId = uuidv4(), note) {
    return axios
      .put(
        `${API_URL}/${feedId}/note/${noteId}`,
        { note },
        { headers: authHeader() }
      )
      .then((response) => {
        return response.data;
      });
  }

  createFile({
    fileId,
    contactId = null,
    organizationId = null,
    dealId = null,
  }) {
    return axios
      .post(
        `${API_URL}/file`,
        {
          file_id: fileId,
          contact_id: contactId,
          organization_id: organizationId,
          deal_id: dealId,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  getFiles({ contactId, organizationId, dealId }, { page = 1, limit = 10 }) {
    return axios
      .get(`${API_URL}/file`, {
        headers: authHeader(),
        params: {
          contact_id: contactId,
          organization_id: organizationId,
          deal_id: dealId,
          page,
          limit,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  getComments(feedId, { page = 1, limit = 3 }) {
    return axios
      .get(`${API_URL}/${feedId}/comments`, {
        headers: authHeader(),
        params: {
          page,
          limit,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  addComment(feedId, comment) {
    return axios
      .post(
        `${API_URL}/comments`,
        {
          comment,
          feed_id: feedId,
        },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  editComment(id, comment) {
    return axios
      .put(`${API_URL}/comments/${id}`, { comment }, { headers: authHeader() })
      .then((response) => {
        return response.data;
      })
      .catch((e) => console.log(e));
  }

  deleteComment(id) {
    return axios
      .delete(`${API_URL}/comments/${id}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      })
      .catch((e) => console.log(e));
  }

  addActivity({ ...props }) {
    return axios
      .post(
        `/api/activities`,
        { ...props },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  // updateActivityFeed
  updateActivityFeed(feedId, activityId, data) {
    return axios
      .put(
        `${API_URL}/${feedId}/activity/${activityId}`,
        { ...data },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  getActivities(
    { contactId, organizationId, dealId, done, oldest },
    { page = 1, limit = 15 }
  ) {
    return axios
      .get(`${API_URL}/activity`, {
        headers: authHeader(),
        params: {
          contactId,
          organizationId,
          dealId,
          done,
          oldest,
          limit,
          page,
        },
      })
      .then((response) => {
        return response.data;
      });
  }

  getActivity(activityId) {
    return axios
      .get(`${API_URL}/activities/${activityId}`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response;
      });
  }

  getFeedActivity(activityId) {
    return axios
      .get(`${API_URL}/activities/${activityId}/feed`, {
        headers: authHeader(),
      })
      .then((response) => {
        return response.data;
      });
  }

  // updateActivity
  updateActivity({ ...props }) {
    return axios
      .put(
        `${API_URL}/activity`,
        { ...props },
        {
          headers: authHeader(),
        }
      )
      .then((response) => {
        return response.data;
      });
  }

  getTapsTypes(params) {
    return axios
      .get(`${API_URL}/taps-types`, {
        headers: authHeader(),
        params,
      })
      .then((response) => {
        return response.data;
      });
  }
}

export default new FeedService();
