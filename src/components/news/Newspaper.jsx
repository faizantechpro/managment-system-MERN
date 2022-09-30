import { Row, Col, Image } from 'react-bootstrap';
import Pagination from '../Pagination';
import moment from 'moment';

const Newspaper = ({ articles, pagination, onPageChange }) => {
  const getFriendlyDate = (ts) => {
    const now = moment().utc();
    const d = new Date(ts);
    const published = moment(d).utc();

    const mins = now.diff(published, 'minutes');
    const hours = now.diff(published, 'hours');
    const days = now.diff(published, 'days');

    if (days !== 0) {
      return days + 'd';
    } else if (hours !== 0) {
      return hours + 'h';
    } else if (mins !== 0) {
      return mins + 'mins';
    }
  };

  return (
    <>
      <div>
        {articles.length === 0 ? <p>News not available for such query.</p> : ''}
      </div>
      {articles.map((article, index) => (
        <Row key={index}>
          <Col xs={12} className="border-bottom">
            <Row>
              <Col xs={8}>
                <div className="px-3 py-3 mt-4">
                  <a href={article.url} target="_blank" rel="noreferrer">
                    <h5 className="cursor-pointer font-weight-bold">
                      {article.title}
                    </h5>
                  </a>
                  <p className="cursor-pointer text-muted">{article.blurb}</p>
                  <p>
                    <span className="font-weight-medium">
                      {article.source} -
                    </span>
                    <span className="text-muted">
                      {' ' + getFriendlyDate(article.published)}
                    </span>
                  </p>
                </div>
              </Col>
              <Col xs={4}>
                <div className="px-4 py-4">
                  <a href={article.url} target="_blank" rel="noreferrer">
                    <Image
                      className="cursor-pointer"
                      fluid="true"
                      rounded="true"
                      src={
                        article.image ||
                        '/img/placeholders/News-Placeholder.png'
                      }
                    />
                  </a>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      ))}
      <Row>
        {articles.length > 0 ? (
          <Col xs={{ span: 4, offset: 5 }}>
            <div className="mt-3">
              <Pagination
                paginationInfo={pagination}
                onPageChange={onPageChange}
              />
            </div>
          </Col>
        ) : (
          ''
        )}
      </Row>
    </>
  );
};

export default Newspaper;
