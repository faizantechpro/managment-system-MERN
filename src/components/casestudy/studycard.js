import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';

function CardProgress() {
  return (
    <div className="card-progress-wrap">
      <div className="progress card-progress">
        <div className={`progress-bar bg-primary width-full`} />
      </div>
    </div>
  );
}

export default function StudyCard(props) {
  const { lesson, icon } = props;
  const category = lesson.category?.title;
  const path = `/training/case-studies/${lesson.slug}`;
  const link = path;
  const textColor = 'text-primary';

  return (
    <Card className="h-100">
      <CardProgress />
      <CardBody>
        <div className="d-flex flex-column text-block text-hover-green">
          <div className="row d-flex flex-row align-items-center mb-4">
            <div className="col">
              <span
                className={`material-icons-outlined font-size-7xl ${textColor}`}
              >
                {icon}
              </span>
            </div>
            <div className="col-auto"></div>
          </div>
          <div className="mb-3">
            <Link to={link}>
              <h3 className="card-title text-hover-primary mb-2">
                {lesson.title}
              </h3>
            </Link>
            <span className="card-text text-muted font-size-sm">
              {category}
            </span>

            <div className="text-center mt-5">
              <Link to={link}>
                <span className="btn btn-primary">Play Video</span>
              </Link>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
