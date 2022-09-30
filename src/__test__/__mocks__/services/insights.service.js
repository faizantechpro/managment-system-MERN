export const dataGetDashboards = {
  count: 2,
  rows: [
    {
      id: 'dashboard_1',
      name: 'Dashboard 1',
      created_by: 'user_1',
      tenant_id: 'tenant_1',
      created_at: '2022-01-13T21:53:53.702Z',
      updated_at: '2022-01-13T21:53:53.702Z',
    },
    {
      id: 'dashboard_2',
      name: 'Dashboard 2',
      created_by: 'user_1',
      tenant_id: 'tenant_1',
      created_at: '2022-01-14T21:53:53.702Z',
      updated_at: '2022-01-14T21:53:53.702Z',
    },
  ],
};

export const dataGetReports1 = {
  count: 1,
  rows: [
    {
      report_id: 'report_id_1',
      dashboard_id: 'dashboard_id_1',
      position: 0,
      insight_report: {
        id: 'insight_report_id_1',
        name: 'Lessons started and completed',
        icon: 'local_library',
        created_by: null,
        tenant_id: '000000000000',
      },
    },
  ],
};

export const dataGetReports2 = {
  count: 1,
  rows: [
    {
      report_id: 'report_id_2',
      dashboard_id: 'dashboard_id_2',
      position: 0,
      insight_report: {
        id: 'insight_report_id_2',
        name: 'Popular lessons',
        icon: 'local_library',
        created_by: null,
        tenant_id: '000000000000',
      },
    },
  ],
};
