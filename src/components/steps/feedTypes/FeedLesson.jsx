import React from 'react';
import { Link } from 'react-router-dom';

const FeedLesson = ({ data }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="mr-2">
          <Link to={`/training/lessons/${data?.id}`}>
            <h4>{data?.title}</h4>
          </Link>
          <p className="d-gray">{data?.duration && `${data.duration} min`}</p>
        </div>
      </div>
    </div>
  );
};

FeedLesson.defaultProps = {
  data: {},
};

export default FeedLesson;
