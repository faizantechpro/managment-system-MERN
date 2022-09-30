import React, { useState, useContext } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import stringConstants from '../../utils/stringConstants.json';
import ButtonIcon from '../commons/ButtonIcon';
import { useForm } from 'react-hook-form';
import InputValidation from '../commons/InputValidation';
import Asterick from '../commons/Asterick';
import { CategoriesContext } from '../../contexts/categoriesContext';
import courseService from '../../services/course.service';
import { CATEGORY_REQUIRED, DRAFT } from '../../utils/constants';
import IdfSelectCategory from '../idfComponents/idfDropdown/IdfSelectCategory';
import ControllerValidation from '../commons/ControllerValidation';

const constants = stringConstants.settings.resources.categories;

const ModalCreateCourse = ({ showModal, setShowModal, onCreate }) => {
  const defaultCourseForm = {
    name: '',
    description: '',
    category_id: '',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [courseForm, setCourseForm] = useState({});
  const { setRefresh } = useContext(CategoriesContext);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultCourseForm,
  });

  const onHandleCloseModal = () => {
    setCourseForm({});
    reset(defaultCourseForm);
    setShowModal(false);
  };

  const CategoryLabel = () => (
    <>
      Category <Asterick />
    </>
  );

  const onChange = (e) => {
    const { value } = e.target;
    setCourseForm({ ...courseForm, category_id: value });
    setValue('category_id', value);
  };

  const onSubmit = async () => {
    setIsLoading(true);

    const { id } = await courseService.saveCourseLessons({
      ...courseForm,
      status: DRAFT,
      lessons: [],
      is_learning_path: false,
    });

    onCreate({ id, category: courseForm.category });
    onHandleCloseModal();
    reset(defaultCourseForm);
    setIsLoading(false);

    // this is updating a categories context so that when any category is updated
    // we also trigger an update to refresh call from api for sidemenu navigation
    setRefresh((prevState) => prevState + 1);
  };

  const handleChange = (e) => {
    const target = e.target;
    setCourseForm((prev) => ({ ...prev, [target.name]: target.value }));
  };

  return (
    <Modal isOpen={showModal} fade={false}>
      <ModalHeader tag="h2" toggle={onHandleCloseModal} className="pb-2">
        Add Course
      </ModalHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="borderline-top">
          <FormGroup>
            <Label for="title">
              Course Name <Asterick />
            </Label>
            <InputValidation
              name="name"
              type="input"
              placeholder="Course Name"
              value={courseForm.name}
              validationConfig={{
                required: true,
                inline: false,
                onChange: handleChange,
              }}
              errors={errors}
              register={register}
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <InputValidation
              name="description"
              type="textarea"
              placeholder="Description"
              value={courseForm.description}
              validationConfig={{
                required: false,
                onChange: handleChange,
                maxLength: {
                  value: 255,
                  message: 'Description cannot exceed 255 characters.',
                },
              }}
              errors={errors}
              register={register}
              classNames="min-h-120"
            />
          </FormGroup>
          <FormGroup>
            <ControllerValidation
              name="category_id"
              control={control}
              errors={errors}
              form={courseForm}
              renderer={({ field }) => (
                <IdfSelectCategory
                  id="category"
                  label={<CategoryLabel />}
                  {...field}
                  onChange={onChange}
                  on
                  errorClass={`${
                    errors.category_id && !courseForm.category_id
                      ? 'border-danger border'
                      : ''
                  }`}
                  value={courseForm.category_id || ''}
                />
              )}
              validationConfig={{
                required: { value: true, message: CATEGORY_REQUIRED },
              }}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            className="btn btn-white btn-sm mr-1"
            data-dismiss="modal"
            onClick={onHandleCloseModal}
            disabled={isLoading}
          >
            Cancel
          </button>

          <ButtonIcon
            type="submit"
            loading={isLoading}
            color="primary"
            label={constants.create}
            classnames="btn-sm"
          ></ButtonIcon>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ModalCreateCourse;
