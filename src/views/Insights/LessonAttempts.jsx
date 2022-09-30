import GenericTable from '../../components/GenericTable';

const LessonAttempts = (results) => {
  const { data } = results[0];

  const rows = data.map((result, index) => {
    const rank = index + 1;
    const progress = Number(result['LessonProgress.avg']);

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
          key: 'lessons',
          component: result['LessonProgress.sumOfAttempts'],
        },
        {
          key: 'progress',
          component: (
            <span>
              {progress.toFixed(progress % 1 === 0 ? 0 : 2)}
              {' %'}
            </span>
          ),
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
              component: 'Lesson Name',
              width: '30%',
            },
            {
              key: 'attempts',
              component: 'Attempts',
            },
            {
              key: 'progress',
              component: 'COMPLETED %',
            },
          ]}
          usePagination={false}
          noDataInDbValidation={true}
        />
      </div>
    </div>
  );
};

export default LessonAttempts;
