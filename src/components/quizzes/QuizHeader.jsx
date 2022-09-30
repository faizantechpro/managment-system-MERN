import stringConstants from '../../utils/stringConstants.json';

const constants = stringConstants.settings.resources.quizzes;

const QuizHeader = ({
  handleSubmit,
  loading,
  onHandlePublish,
  isPublish,
  quizId,
  goBack,
}) => {
  const published =
    isPublish === constants.publishedStatus
      ? constants.unpublishQuizLabel
      : constants.publishQuizLabel;

  return (
    <div className="card-header">
      <div className="d-flex align-items-baseline">
        {goBack && (
          <button
            className="btn btn-light btn-sm mr-2 border-secondary"
            onClick={() => {
              goBack(false);
            }}
          >
            <span className="material-icons-outlined">arrow_back</span>
          </button>
        )}
        <h3 className="card-title h3 section-title">Quiz</h3>
      </div>
      <div>
        <button
          className="btn btn-light btn-sm mr-2 border-secondary"
          onClick={handleSubmit}
          disabled={loading || isPublish === constants.publishedStatus}
        >
          {constants.saveLabel}
        </button>
        <button
          className="btn btn-primary btn-sm border-0 btn-primary-dark"
          disabled={loading || !quizId}
          onClick={onHandlePublish}
        >
          {published}
        </button>
      </div>
    </div>
  );
};

export default QuizHeader;
