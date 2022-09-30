import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import lessonService from '../../../../services/lesson.service';

const Statistics = ({ totalCourses, badges, userId }) => {
  const [lessonsSummary, setLessonsSummary] = useState({});

  const getSummary = async () => {
    try {
      const data = await lessonService.GetSummary(userId);
      setLessonsSummary(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      getSummary();
    }
  }, [userId]);

  return (
    <>
      <h4>User statistics</h4>
      <Row className="mb-2">
        <Col md="6">
          <div className="align-items-center media">
            <i className="material-icons-outlined font-size-3xl text-primary mr-3">
              fact_check
            </i>
            <div className="media-body">
              <p className="d-block mb-0">Points</p>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{lessonsSummary?.total_points}</h2>
              </div>
            </div>
          </div>
        </Col>

        <Col md="6">
          <div className="align-items-center media">
            <i className="material-icons-outlined font-size-3xl text-primary mr-3">
              cast_for_education
            </i>
            <div className="media-body">
              <p className="d-block mb-0">Courses</p>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{totalCourses}</h2>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col md="6">
          <div className="align-items-center media">
            <i className="material-icons-outlined font-size-3xl text-primary mr-3">
              class
            </i>
            <div className="media-body">
              <p className="d-block mb-0">Lessons</p>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{lessonsSummary.completed}</h2>
              </div>
            </div>
          </div>
        </Col>

        <Col md="6">
          <div className="align-items-center media">
            <i className="material-icons-outlined font-size-3xl text-primary mr-3">
              stars
            </i>
            <div className="media-body">
              <p className="d-block mb-0">Badges</p>
              <div className="d-flex align-items-center">
                <h2 className="mb-0">{badges?.length}</h2>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <hr />
    </>
  );
};

export default Statistics;
