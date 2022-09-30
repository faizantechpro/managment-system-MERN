import GenericTable from '../../components/GenericTable';
import Avatar from '../../components/Avatar';

const ActiveTrainingUsers = (results) => {
  const { data } = results[0];

  const rows = data.map((result, index) => {
    const user = {
      firstName: result['User.firstName'],
      lastName: result['User.lastName'],
      avatar: result['User.avatar'],
    };
    const name = `${result['User.firstName']} ${result['User.lastName']}`;
    const rank = index + 1;

    return {
      id: index,
      dataRow: [
        {
          key: 'rank',
          component: (
            <div className="rank-container">
              <span className={`rank-${rank}`}>{rank}</span>
            </div>
          ),
        },
        {
          key: 'name',
          component: (
            <div className="d-flex align-items-center">
              <Avatar classModifiers="mr-2" user={user} />
              {name}
            </div>
          ),
        },
        {
          key: 'lessons',
          component: result['LessonProgress.count'],
        },
      ],
    };
  });

  return (
    <div style={{ maxWidth: '1220px' }}>
      <div style={{ height: '400px' }}>
        <GenericTable
          checkbox={false}
          data={rows}
          columns={[
            {
              key: 'rank',
              component: 'Rank',
              width: '5%',
            },
            {
              key: 'name',
              component: 'Name',
              width: '30%',
            },
            {
              key: 'lessons',
              component: 'Completed lesson',
            },
          ]}
          usePagination={false}
          noDataInDbValidation={true}
        />
      </div>
    </div>
  );
};

export default ActiveTrainingUsers;
