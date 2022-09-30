import {
  PUBLISH_LESSON,
  TITLE_LABEL,
  CONTENT_LABEL,
  TAG_LABEL,
} from '../../utils/constants';
import InputValidation from '../commons/InputValidation';
import ButtonIcon from '../commons/ButtonIcon';
import React from 'react';
import MaterialIcon from '../commons/MaterialIcon';

const LessonAdminHeader = ({
  loading,
  loadingPublish,
  onHandlePublish,
  lessonForm,
  dispatch,
  goBack,
  register,
  errors,
  lessonId,
}) => {
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

  return (
    <div className="card-header px-3">
      <div className="d-flex flex-grow-1 align-items-baseline mr-2">
        {goBack && (
          <button
            className="btn btn-white mr-2"
            data-uw-styling-context="true"
            onClick={() => {
              goBack(false);
            }}
          >
            <MaterialIcon icon="close" clazz="text-black" />
          </button>
        )}
        <InputValidation
          name={TITLE_LABEL}
          value={lessonForm.title || ''}
          register={register}
          type="input"
          placeholder="Lesson Name"
          errorDisplay="position-absolute error-show-right"
          errors={errors}
          validationConfig={{
            required: true,
            inline: true,
            onChange: onInputChange,
          }}
        />
      </div>
      <div>
        <ButtonIcon
          loading={loading}
          type="submit"
          label={'Save Draft'}
          color="white"
          classnames="mr-2"
        />
        <ButtonIcon
          label={PUBLISH_LESSON}
          type="button"
          color="primary"
          classnames="btn-secondary"
          loading={loadingPublish}
          onclick={onHandlePublish}
          disabled={!lessonForm.title}
        />
      </div>
    </div>
  );
};

export default LessonAdminHeader;
