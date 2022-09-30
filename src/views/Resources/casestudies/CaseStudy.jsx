import SubHeading from '../../../components/subheading';
import StudyCard from '../../../components/casestudy/studycard';
import { Row, Col } from 'reactstrap';
import { caseStudiesCollection } from './constants/CaseStudy.constants';

function CaseStudy() {
  return (
    <>
      <SubHeading title={'Case Studies'} />
      <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3">
        {caseStudiesCollection.map((lesson, indx) => (
          <Col key={indx} className="mb-5">
            <StudyCard lesson={lesson} icon={'movie'} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export default CaseStudy;
