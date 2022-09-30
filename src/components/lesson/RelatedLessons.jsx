import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import lessonService from '../../services/lesson.service';
import { Link } from 'react-router-dom';
import routes from '../../utils/routes.json';

const RelatedLessons = () => {
  const [relatedLessons, setRelatedLessons] = useState(undefined);

  const getRelatedLessons = async () => {
    try {
      const result = await lessonService.getRelatedLessons();
      setRelatedLessons(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRelatedLessons();
  }, []);

  return (
    <div>
      <div className="related-lessons">
        <h4 className="text-align-left">Related Training</h4>

        {relatedLessons?.map((lesson) => (
          <Card key={lesson.id} className="mb-3 py-3 px-3">
            <Link to={`${routes.lesson.replace(':id', lesson.id)}`}>
              <div className="d-flex align-items-center">
                <span className="material-icons-outlined mr-2 p-2 bg-gray-300 icon-circle text-primary">
                  {lesson.icon || 'summarize'}
                </span>
                <p className="text-black mb-0 font-weight-semi-bold text-truncate ">
                  {lesson.title}
                </p>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RelatedLessons;
