import { useEffect, useState } from 'react';
import Heading from '../../../components/heading';
import { Row, Col, CardBody, Card } from 'reactstrap';
import { useParams } from 'react-router-dom';
import { caseStudiesCollection } from './constants/CaseStudy.constants';
import WistiaEmbed from '../../../components/wistia';

export default function CaseStudyVideo() {
  const { slug } = useParams();
  const [title, setTitle] = useState('');
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    const caseStudy = caseStudiesCollection.filter((c) => c.slug === slug);
    setTitle(caseStudy[0].title);
    setVideoId(caseStudy[0].video_id);
  }, []);

  return (
    <div>
      <Heading title={title} useBc />
      <Row className="mb-6">
        <Col>
          <Card className="bg-soft-primary">
            <CardBody className="px-md-8 py-md-6 text-center">
              <WistiaEmbed
                hashedId={videoId}
                isResponsive={true}
                autoPlay={true}
                videoFoam={true}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
