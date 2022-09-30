import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import Loading from '../../../../components/Loading';
import Steps from '../../../../components/steps/Steps';
import userService from '../../../../services/user.service';
import courseService from '../../../../services/course.service';
import Info from './Info';

const Profile = () => {
  const { id: userId } = useParams();
  const [profileInfo, setProfileInfo] = useState(undefined);
  // const [totalCourses, setTotalCourses] = useState(undefined);
  // const [badges, setBadges] = useState([]);
  const [me, setMe] = useState(null);

  const getProfileInfo = async () => {
    try {
      const [data, completedCourses] = await Promise.all([
        userService.getUserById(userId),
        courseService.getCoursesCompleted(userId),
      ]);

      // setTotalCourses(completedCourses?.count || 0);
      setProfileInfo(data);
      getBadges(completedCourses);
    } catch (error) {
      console.log(error);
    }
  };

  const getBadges = (coursesSummary) => {
    if (coursesSummary?.rows.length > 0) {
      // const badgesList = coursesSummary.rows.map((item) => {
      //   return item.CourseModel.badge;
      // });
      // setBadges(badgesList);
    }
  };

  const getCurrentUser = async () => {
    const me = await userService
      .getUserInfo()
      .catch((err) => console.error(err));

    setMe(me);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    getProfileInfo();
  }, [userId]);

  return (
    <div>
      {profileInfo ? <Info profileInfo={profileInfo} /> : <Loading />}

      <hr />

      <Row className="mb-4">
        {/* <Col md="4">
          <Card>
            <Card.Body>
              <Statistics
                userId={userId}
                totalCourses={totalCourses}
                badges={badges}
              />
              <Badges badgeList={badges} />
            </Card.Body>
          </Card>
        </Col> */}

        <Col md="12">
          {userId ? (
            <Steps fetchAll userId={userId} limit={5} me={me} />
          ) : (
            <Loading />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
