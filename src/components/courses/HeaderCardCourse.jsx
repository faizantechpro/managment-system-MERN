import React from 'react';
import stringConstants from '../../utils/stringConstants.json';
import ButtonIcon from '../commons/ButtonIcon';
import InputValidation from '../commons/InputValidation';

const constants = stringConstants.settings.resources.courses;

const HeaderCardCourses = ({
  loading,
  loadingPublish,
  onHandlePublished,
  goBack,
  register,
  errors,
  courseForm,
  onHandleChange,
  courseId,
}) => {
  const onInputChange = (e) => {
    onHandleChange(e);
  };

  return (
    <div className="card-header px-3">
      <div className="d-flex flex-grow-1 align-items-baseline mr-2">
        <ButtonIcon
          label=""
          icon="close"
          type="button"
          color="white"
          classnames="mr-2 text-black"
          onclick={() => {
            goBack(false);
          }}
        />
        <InputValidation
          name="name"
          value={courseForm.name || ''}
          register={register}
          type="input"
          placeholder="Course Name"
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
          label="Save Draft"
          color="white"
          classnames="mr-2"
        />
        <ButtonIcon
          label={constants.publishCourse}
          type="button"
          color="primary"
          classnames="btn-secondary"
          loading={loadingPublish}
          onclick={onHandlePublished}
          disabled={!courseId}
        />
      </div>
    </div>
  );
};

export default HeaderCardCourses;
