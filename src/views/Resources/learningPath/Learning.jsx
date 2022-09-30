import { useEffect, useState } from 'react';
import Heading from '../../../components/heading';
import courseService from '../../../services/course.service';
import {
  COURSES,
  COURSES_COMMING_SOON_TEXT,
  LEARNING_PATH,
} from '../../../utils/constants';
import CategorySection from '../category/CategorySection';

const Learning = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getLearningPath() {
      setLoading(true);

      const resp = await courseService
        .getCourses({
          page: 1,
          limit: 1000,
          is_learning_path: true,
          deleted: false,
          status: 'published',
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });

      setCourses(resp?.data);
      setLoading(false);
    }

    getLearningPath();
  }, []);

  return (
    <>
      <Heading title={LEARNING_PATH} useBc />

      <CategorySection
        data={courses}
        loading={loading}
        title={COURSES}
        sectionType="course"
        commingSoonText={COURSES_COMMING_SOON_TEXT}
      />
    </>
  );
};

export default Learning;
