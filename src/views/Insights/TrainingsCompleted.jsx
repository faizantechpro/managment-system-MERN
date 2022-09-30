import GenericTable from '../../components/GenericTable';

const TrainingsCompleted = (results) => {
  const { data } = results[0];

  const rows = data.map((result, index) => {
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
          component: result['Lesson.title'],
        },
        {
          key: 'completed',
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
              component: 'Lessons',
              width: '30%',
            },
            {
              key: 'attempts',
              component: 'Number of users',
            },
          ]}
          usePagination={false}
          noDataInDbValidation={true}
        />
      </div>
    </div>
  );
};

export default TrainingsCompleted;
