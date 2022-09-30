import React, { useState } from 'react';
import { FormGroup, Input, Label } from 'reactstrap';

import LessonAdminContent from './LessonAdminContent';
import routes from '../../utils/routes.json';
import { useHistory } from 'react-router';

import {
  CATEGORY_REQUIRED,
  CHOOSE_IMAGE_FILE,
  CONTENT_LABEL,
  DURATION,
  LESSON_REMOVED,
  LESSON_SETTINGS_LABEL,
  MAX_ATTEMPS,
  MAX_POINTS,
  MAX_WEIGHT,
  MAX_WEIGHT_ERROR_MESSAGE,
  PDF_FORMAT_ERROR,
  SERVER_ERROR,
  TAG_LABEL,
  TITLE_LABEL,
} from '../../utils/constants';
import IdfSelectCategory from '../idfComponents/idfDropdown/IdfSelectCategory';
import MaterialIcon from '../commons/MaterialIcon';
import lessonService from '../../services/lesson.service';
import DeleteLesson from './DeleteLesson';
import Asterick from '../commons/Asterick';
import DragDropUploadFile from '../commons/DragDropUploadFile';
import ControllerValidation from '../commons/ControllerValidation';

const LessonForm = (props) => {
  const {
    lessonForm,
    dispatch,
    pdf,
    setPdf,
    onAddPage,
    pages,
    onSetPageInfo,
    onRemovePage,
    setErrorMessage,
    setSuccessMessage,
    onHandleChangeOrder,
    lessonId,
    errors,
    control,
    setValue,
    goBack,
  } = props;

  const [isLoading] = useState(false);
  const [removeLessonModal, setRemoveLessonModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const history = useHistory();
  const [minimize, setMinimize] = useState(!!lessonId);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    const payload =
      name !== TITLE_LABEL && name !== CONTENT_LABEL && name !== TAG_LABEL
        ? Number(value)
        : value;

    dispatch({
      type: 'set',
      input: name,
      payload,
    });
  };

  const onLoadPdf = async (event) => {
    const target = event.target.files[0];

    if (target?.type !== 'application/pdf') {
      setErrorMessage(PDF_FORMAT_ERROR);

      return setPdf(pdf || null);
    }

    if (target.size > MAX_WEIGHT) {
      setErrorMessage(MAX_WEIGHT_ERROR_MESSAGE);

      return setPdf(pdf || null);
    }

    setPdf(target);
  };

  const onAddTag = (e) => {
    if (e.code === 'Enter' || e.code === 'Tab' || e.code === 'Comma') {
      e.preventDefault();

      const newTags = lessonForm?.tags?.slice() || [];

      newTags.push(lessonForm.tag);

      dispatch({
        type: 'set',
        input: TAG_LABEL,
        payload: '',
      });

      dispatch({
        type: 'set',
        input: 'tags',
        payload: newTags,
      });

      setValue('tagHidden', newTags);
      dispatch({
        type: 'set',
        input: 'tagHidden',
        payload: newTags,
      });
    }
  };

  const removeTag = (tag) => {
    const newTags = lessonForm.tags.filter((item) => item !== tag);

    dispatch({
      type: 'set',
      input: 'tags',
      payload: newTags,
    });

    setValue('tagHidden', newTags.length ? newTags : '');
    dispatch({
      type: 'set',
      input: 'tagHidden',
      payload: newTags.length ? newTags : '',
    });
  };

  const onChange = (e) => {
    setValue('categoryId', e.target.value);
    onInputChange(e, dispatch);
  };

  const onDeleteLesson = async () => {
    setModalLoading(true);
    const resp = await lessonService
      .deleteLesson(lessonId)
      .catch((err) => console.log(err));

    if (!resp) {
      setErrorMessage(SERVER_ERROR);
    } else {
      setSuccessMessage(LESSON_REMOVED);
      history.push(routes.training);
      goBack();
    }

    setRemoveLessonModal(false);
    setModalLoading(false);
  };

  const toggleModal = () => {
    setRemoveLessonModal((prev) => !prev);
  };

  const CategoryLabel = () => (
    <>
      Category <Asterick />
    </>
  );

  const OptionalText = () => {
    return <span className="fs-8 font-weight-normal">(optional)</span>;
  };

  return (
    <>
      {removeLessonModal && (
        <DeleteLesson
          removeLessonModal={removeLessonModal}
          onDeleteLesson={onDeleteLesson}
          toggleModal={toggleModal}
          modalLoading={modalLoading}
          setModalLoading={setModalLoading}
          lessonId={lessonId}
        />
      )}
      <div>
        <div className="w-100 pt-3">
          <LessonAdminContent
            lessonId={lessonId}
            onAddPage={onAddPage}
            pages={pages}
            onSetPageInfo={onSetPageInfo}
            onRemovePage={onRemovePage}
            setErrorMessage={setErrorMessage}
            onHandleChangeOrder={onHandleChangeOrder}
          />
        </div>
        <div className="px-3">
          <div className="card shadow-none rounded pb-0 mb-3">
            <div className="card-header px-3">
              <div
                className="d-flex align-items-center cursor-pointer"
                onClick={() => setMinimize(!minimize)}
              >
                <div>
                  <MaterialIcon
                    icon={minimize ? 'add' : 'remove'}
                    clazz="mr-1"
                  />
                  <span className="text-primary fw-bold">
                    {LESSON_SETTINGS_LABEL}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={`card-body px-0 pb-0 ${
                minimize ? 'd-none' : 'd-block'
              }`}
            >
              <div>
                <div className="px-3">
                  <div className="row">
                    <div className="col-md-12">
                      <ControllerValidation
                        name="categoryId"
                        control={control}
                        errors={errors}
                        form={lessonForm}
                        renderer={({ field }) => (
                          <IdfSelectCategory
                            id="category"
                            label={<CategoryLabel />}
                            {...field}
                            onChange={onChange}
                            errorClass={`${
                              errors.categoryId && !lessonForm.categoryId
                                ? 'border-danger border'
                                : ''
                            }`}
                            value={lessonForm.categoryId || ''}
                          />
                        )}
                        validationConfig={{
                          required: { value: true, message: CATEGORY_REQUIRED },
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <FormGroup>
                        <Label htmlFor={TAG_LABEL}>
                          Tags <Asterick />
                        </Label>
                        <Input
                          type="text"
                          placeholder="Tags"
                          name={TAG_LABEL}
                          id={TAG_LABEL}
                          value={lessonForm.tag || ''}
                          className={
                            errors.tagHidden && !lessonForm.tagHidden
                              ? 'border-danger'
                              : ''
                          }
                          onChange={onInputChange}
                          onKeyDown={onAddTag}
                        />
                        <ControllerValidation
                          name="tagHidden"
                          errors={errors}
                          form={lessonForm}
                          control={control}
                          validationConfig={{
                            required: {
                              value: true,
                              message: 'At least one tag is required.',
                            },
                          }}
                          renderer={({ field }) => (
                            <Input
                              type="hidden"
                              {...field}
                              placeholder="Tags"
                              name={TAG_LABEL}
                              id={TAG_LABEL}
                              value={lessonForm.tagHidden || ''}
                            />
                          )}
                        />
                        {lessonForm.tags?.length ? (
                          <div className="mt-2">
                            {lessonForm.tags?.map((tag) => (
                              <div
                                key={tag}
                                className="tag-item rounded-lg align-items-center h-auto p-1 pl-2"
                              >
                                <span className="fw-normal fs-8 font-weight-semi-bold text-capitalize text-wrap">
                                  {tag}
                                </span>
                                <button
                                  type="button"
                                  className="button ml-0"
                                  onClick={() => removeTag(tag)}
                                >
                                  <MaterialIcon icon="close" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          ''
                        )}
                      </FormGroup>
                    </div>
                    <div className="col-md-6">
                      <FormGroup>
                        <Label htmlFor={DURATION}>
                          Duration <OptionalText />
                        </Label>
                        <Input
                          type="number"
                          name={DURATION}
                          id={DURATION}
                          placeholder="Duration"
                          value={lessonForm.duration || ''}
                          onChange={onInputChange}
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <FormGroup>
                        <Label htmlFor={MAX_POINTS}>
                          Max Points <OptionalText />{' '}
                        </Label>
                        <Input
                          type="number"
                          name={MAX_POINTS}
                          id={MAX_POINTS}
                          placeholder="Max Points"
                          value={lessonForm.maxPoints || ''}
                          onChange={onInputChange}
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md-6">
                      <FormGroup>
                        <Label htmlFor={MAX_ATTEMPS}>
                          Max Attempts <OptionalText />
                        </Label>
                        <Input
                          type="number"
                          name={MAX_ATTEMPS}
                          id={MAX_ATTEMPS}
                          placeholder="Max Attempts"
                          value={lessonForm.maxAttemps || ''}
                          onChange={onInputChange}
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <FormGroup>
                    <Label htmlFor={MAX_POINTS}>Upload File</Label>
                    <DragDropUploadFile
                      file={pdf}
                      setFile={setPdf}
                      onLoadFile={onLoadPdf}
                      allowedFormat="name/pdf"
                      chooseFileText={CHOOSE_IMAGE_FILE}
                      isLoading={isLoading}
                      emptyContainerHeight={80}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LessonForm;
