import { Form, FormGroup, Input, Label } from 'reactstrap';

import QuizAddContent from './QuizAddContent';

const QuizForm = (props) => {
  const {
    quizId,
    quizForm,
    dispatch,
    onAddPage,
    pages,
    onSetPageInfo,
    onRemovePage,
    setErrorMessage,
    onHandleChangeOrder,
  } = props;

  const onInputChange = (e) => {
    const { name, value } = e.target;

    const payload =
      name !== 'intro' && name !== 'description'
        ? Math.abs(Number(value))
        : value;

    dispatch({
      type: 'set',
      input: name,
      payload,
    });
  };

  return (
    <Form className="p-3 mb-4" onSubmit={(e) => e.preventDefault()}>
      <FormGroup className="d-flex justify-content-between align-items-center">
        <Label htmlFor="intro" className="label-title">
          Quiz Name
        </Label>
        <Input
          type="text"
          name="intro"
          id="intro"
          className="w-100"
          placeholder="Quiz Name"
          value={quizForm.intro || ''}
          onChange={onInputChange}
        />
      </FormGroup>
      <FormGroup className="d-flex justify-content-between align-items-center">
        <Label htmlFor="description" className="label-title">
          Description
        </Label>
        <Input
          type="text"
          name="description"
          id="description"
          className="w-100"
          placeholder="Quiz Description"
          value={quizForm.description || ''}
          onChange={onInputChange}
        />
      </FormGroup>

      <div className="dropdown-divider" />

      <div className="d-flex">
        <div className="pr-3 mt-2 w-100">
          <h6 className="section-subtitle">Quiz Content</h6>

          <div className="dropdown-divider mt-3 mb-3" />

          <QuizAddContent
            quizId={quizId}
            onAddPage={onAddPage}
            pages={pages}
            onSetPageInfo={onSetPageInfo}
            onRemovePage={onRemovePage}
            setErrorMessage={setErrorMessage}
            onHandleChangeOrder={onHandleChangeOrder}
          />
        </div>

        <div className="mt-2 pl-3 lesson-settings">
          <h6 className="section-subtitle">Quiz Settings</h6>

          <div className="dropdown-divider mt-3 mb-3" />
          <FormGroup>
            <Label htmlFor="minimum_score">Minimum Score</Label>
            <Input
              type="number"
              name="minimum_score"
              id="minimum_score"
              min="0"
              minLength="1"
              placeholder="Minimum Score"
              value={quizForm.minimum_score}
              onChange={onInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="max_attempts">Max Attempts</Label>
            <Input
              type="number"
              name="max_attempts"
              id="max_attempts"
              min="0"
              minLength="1"
              placeholder="Max Attempts"
              value={quizForm.max_attempts}
              onChange={onInputChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="review">Review</Label>
            <Input
              type="textarea"
              name="review"
              id="review"
              placeholder="Review"
            />
          </FormGroup>
        </div>
      </div>
    </Form>
  );
};

export default QuizForm;
