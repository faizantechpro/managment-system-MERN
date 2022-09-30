import { Card, CardBody, CardFooter } from 'reactstrap';

import { stacks } from './constants/CardStack';

const CardStack = ({ progressColor }) => {
  return stacks?.map((stack) => (
    <div
      key={stack.id}
      className="position-absolute w-100 h-100"
      style={{
        zIndex: `-${1 * stack.id}`,
        top: `${stack.top}px`,
        left: `${stack.left}px`,
      }}
    >
      <Card className="h-100">
        <div className="card-progress-wrap h-100 rounded-0">
          <div className="progress card-progress rounded-0">
            <div className={`progress-bar ${progressColor} w-100`}></div>
          </div>
        </div>
        <CardBody className="min-h-stack">
          <div className="mb-3"></div>
        </CardBody>
        <CardFooter className="min-h-stack-footer"></CardFooter>
      </Card>
    </div>
  ));
};

export default CardStack;
