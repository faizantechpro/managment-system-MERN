import { useState, useEffect } from 'react';
import { scrollToTop } from '../../utils/Utils';

export default function Nav(props) {
  const [show, setShow] = useState(true);
  const progress = Math.ceil(props.progress * 100);

  useEffect(() => {
    if (
      props.allSteps[0].order === props.current ||
      props.allSteps[props.allSteps.length - 1].order === props.current ||
      (props.state.disable_nav &&
        props.state.retake &&
        props.state.disable_progress)
    ) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [props.allSteps, props.state.disable_nav]);

  const handleNextPrev = (nextPrev) => {
    scrollToTop();
    props[nextPrev]();
  };

  return (
    <>
      {show && (
        <div className="row justify-content-between card-footer align-items-center mt-2 d-flex px-0 border-top-0">
          <div className="col-auto w-40">
            <div className="d-flex flex-row align-items-center justify-content-between font-size-sm font-weight-medium text-black mb-2">
              <span
                className="card-header-title"
                data-uw-styling-context="true"
              >
                Lesson Completion
              </span>
              <span
                className="card-header-title"
                data-uw-styling-context="true"
              >
                {progress}%
              </span>
            </div>
            <div className="progress bg-soft-primary">
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: progress + '%' }}
                aria-valuenow="100"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          {!props.state.disable_nav && (
            <div className="col-auto">
              {props.progress !== 0 && (
                <button
                  className="btn btn-icon btn-soft-primary btn-sm rounded-circle mr-2"
                  onClick={() => handleNextPrev('prev')}
                >
                  <span
                    className="material-icons-outlined"
                    data-uw-styling-context="true"
                  >
                    chevron_left
                  </span>
                </button>
              )}

              {props.progress !== 1 && (
                <button
                  className="btn btn-icon btn-soft-primary btn-sm rounded-circle"
                  onClick={() => handleNextPrev('next')}
                >
                  <span
                    className="material-icons-outlined font-size-xl"
                    data-uw-styling-context="true"
                  >
                    chevron_right
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
