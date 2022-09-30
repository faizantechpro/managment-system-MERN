import React, { useEffect, useState, useContext } from 'react';
import { Row, Col, CardBody, Card } from 'reactstrap';
import { Steps, Step } from 'react-step-builder';
import { useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import Heading from '../../components/heading';
import Nav from '../../components/lesson/nav';
import Page from '../../components/lesson/page';
import Hero from '../../components/lesson/hero';
import SubHeading from '../../components/subheading';
import CardBox from '../../components/lesson/card';
import { API } from '../../services/api';
import lessonService from '../../services/lesson.service';
import categoryService from '../../services/category.service';
import { categoriesDefaultInfo } from '../../views/Resources/category/constants/Category.constants';
import { CategoriesContext } from '../../contexts/categoriesContext';
import {
  COMPLETED,
  CONGRATULATIONS,
  DEFAULT_ICONS,
  LESSON_DELETED,
  OTHER_RECOMMENDED_LESSONS,
  QUIZ,
} from '../../utils/constants';
import Loading from '../../components/Loading';
import { pageTitleBeautify } from '../../utils/Utils';
import CardSkeleton from '../../components/lesson/CardSkeleton';
import CategoryPartnerLogo from '../../components/lesson/CategoryPartnerLogo';

function LessonCard(props) {
  const { lesson } = props;

  const [icon, setIcon] = useState('');
  const { categoryList } = useContext(CategoriesContext);

  useEffect(() => {
    const { category_id: categoryId } = lesson;

    const categoryInfo = categoryList?.find(
      (category) => category.id === categoryId
    );

    if (categoryInfo) {
      const slug = categoryInfo.title
        .toLocaleLowerCase()
        .trim()
        .replace(/ /g, '-');

      const icon = categoriesDefaultInfo[slug]?.icon || DEFAULT_ICONS;
      setIcon(icon);
    }
  }, []);

  return <CardBox item={lesson} icon={icon} />;
}

function OtherLessons(props) {
  const { lessons, title, loading } = props;

  if (loading) return <CardSkeleton count={3} />;

  return (
    <>
      {lessons?.length > 0 && (
        <>
          <SubHeading title={title} />
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3">
            {lessons.map((lesson, indx) => (
              <Col key={indx} className="mb-5">
                <LessonCard lesson={lesson} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export default function Lesson() {
  const api = new API();
  const { id } = useParams();
  const query = useQuery();

  const [lesson, setLesson] = useState(null);
  const [otherLessons, setOtherLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    async function getLessonDetail() {
      window.scrollTo(0, 0);

      setLoading(true);

      const lesson = await api
        .GetLessonById(id)
        .catch((err) => console.log(err));

      if (lesson) {
        if (lesson.status === 'deleted') return setDeleted(true);

        const resp = await lessonService.GetLessonTrackByLessonId(id);

        const { completed_at, status } = resp || {};

        let newPages = lesson.pages
          ?.filter((page) => !page.type.includes(QUIZ))
          .slice();

        if (completed_at && status === COMPLETED) {
          newPages = lesson.pages.filter((page) => !page.type.includes(QUIZ));
        }

        setLoading(false);

        setLesson({
          ...lesson,
          pages: newPages,
        });
      }

      try {
        const resp = await categoryService.GetLessonsByCategory({
          id: lesson.category.id,
          limit: 3,
          random: true,
        });

        const others = resp?.data.filter((item) => item.id !== lesson.id);
        setOtherLessons(others);
        setLoading(false);
      } catch (error) {}
    }

    getLessonDetail();
  }, [id]);

  const config = {
    navigation: {
      component: Nav, // a React component with special props provided automatically
      location: 'after', // or after
    },
  };

  const FirstStep = (props) => {
    if (loading) return <Loading />;

    return <Hero points={lesson.max_points} {...props} />;
  };

  if (!lesson) return <Loading />;

  if (deleted) {
    return (
      <div>
        <h2>{LESSON_DELETED}</h2>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{pageTitleBeautify(['Training', lesson?.title || ''])}</title>
      </Helmet>
      <div className="d-flex align-items-center justify-content-between">
        <Heading title={lesson?.title} pageHeaderDivider="pb-0 mb-0" />
        <CategoryPartnerLogo
          categoryInfo={lesson?.category}
          imageStyle="height-30 ml-1"
        />
      </div>
      <div className="page-header-divider mt-2 mb-3"></div>
      {lesson && (
        <Row className="mb-5">
          <Col>
            <Card className="card-lesson-hero">
              <CardBody>
                <Steps config={config}>
                  <Step
                    title={lesson.title}
                    lesson={lesson}
                    component={(props) => <FirstStep {...props} />}
                  />
                  {lesson.pages?.map((p, indx) => (
                    <Step
                      key={indx}
                      lessonId={lesson.id}
                      firstPage={lesson.pages[0]}
                      title={p.title}
                      component={(props) => <Page {...props} page={p} />}
                    />
                  ))}
                  <Step
                    title={CONGRATULATIONS}
                    lesson={lesson}
                    component={(props) => (
                      <Hero
                        {...props}
                        lesson_id={id}
                        page_id={lesson.pages[lesson.pages.length - 1]?.id}
                        points={lesson.max_points}
                        course={query.get('courseId')}
                      />
                    )}
                  />
                </Steps>
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
      <OtherLessons
        lessons={otherLessons}
        title={OTHER_RECOMMENDED_LESSONS}
        loading={loading}
      />
    </div>
  );
}
