import Where from './Where';

describe('Where', () => {
  const defaultAttrs = [
    'id',
    'status',
    'tenant_id',
    'created_by',
    'assigned_user_id',
  ];

  beforeEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('Should be able to construct entire query', async () => {
    const where = new Where<'ContactDB'>({} as any, defaultAttrs);

    where.timeRange('date_entered', {
      start: '2020-01-01',
      end: '2020-01-02',
    });
    where.iLike('mock search term', 'first_name');
    where.or([{ status: 'mock-value' }, { phone_home: 'mock-value' }]);
    where.context({
      tenantId: 'mock-tenant-id',
      userId: 'mock-user-id',
    });
    where.publicWhere({ status: 'mock-public' });

    expect(where.build()).toMatchSnapshot();
  });
});
