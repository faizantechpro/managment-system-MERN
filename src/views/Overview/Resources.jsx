import { useState, useEffect } from 'react';
import {
  COMPLETED_LESSONS,
  POINTS_EARNED,
  PENDING_LESSONS,
} from '../../utils/constants';
import lessonService from '../../services/lesson.service';

const Resources = () => {
  const [points, setPoints] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    lessonService.GetSummary().then((summary) => {
      if (summary) {
        setPoints(summary.total_points);
        setCompleted(summary.completed);
        setPending(summary.pending);
      }
    });
  }, []);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h4 className="card-header-title">Training</h4>{' '}
      </div>
      <div className="card-body">
        <div className="list-group list-group-lg list-group-flush list-group-no-gutters">
          <div className="list-group-item pb-4">
            <div className="media align-items-center">
              {' '}
              <i className="material-icons-outlined font-size-2xl text-primary mr-3">
                loyalty
              </i>
              <div className="media-body d-flex flex-row align-items-center">
                <h4 className="mb-0">{POINTS_EARNED}</h4>
                <div className="d-flex align-items-center ml-auto">
                  {' '}
                  <h3 className="mb-0">{points || 0}</h3>{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="list-group-item py-4">
            <div className="media align-items-center">
              {' '}
              <i className="material-icons-outlined font-size-2xl text-primary mr-3">
                fact_check
              </i>
              <div className="media-body d-flex flex-row align-items-center">
                <h4 className="mb-0">{COMPLETED_LESSONS}</h4>
                <div className="d-flex align-items-center ml-auto">
                  <h3 className="mb-0">{completed}</h3>{' '}
                </div>
              </div>
            </div>
          </div>
          <div className="list-group-item py-4">
            <div className="media align-items-center">
              {' '}
              <i className="material-icons-outlined font-size-2xl text-primary mr-3">
                pending
              </i>
              <div className="media-body d-flex flex-row align-items-center">
                <h4 className="mb-0">{PENDING_LESSONS}</h4>
                <div className="d-flex align-items-center ml-auto">
                  <h3 className="mb-0">{pending}</h3>{' '}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
