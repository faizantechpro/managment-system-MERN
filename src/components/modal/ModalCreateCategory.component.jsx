import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Form,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

import { icons } from '../manageLessons/ManageLessonsConstants';
import categoryService from '../../services/category.service';
import stringConstants from '../../utils/stringConstants.json';
import ButtonIcon from '../commons/ButtonIcon';
import DragDropUploadFile from '../commons/DragDropUploadFile';
import { useForm } from 'react-hook-form';
import InputValidation from '../commons/InputValidation';
import Asterick from '../commons/Asterick';
import userService from '../../services/user.service';
import { createBlobObject } from '../../utils/Utils';
import { CategoriesContext } from '../../contexts/categoriesContext';
import _ from 'lodash';
import { CHOOSE_IMAGE_FILE } from '../../utils/constants';
import ControllerValidation from '../commons/ControllerValidation';
import MaterialIcon from '../commons/MaterialIcon';
import useOutsideClickDropDown from '../../hooks/useOutsideClickDropDown';

const constants = stringConstants.settings.resources.categories;

const ModalCreateCategory = ({
  showModal,
  setShowModal,
  onSuccess,
  onError,
  editId,
  setEditId,
  getCategories,
}) => {
  const defaultCategoryForm = {
    title: '',
    description: '',
    logo: '',
    icon: '',
  };
  const dropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryForm, setCategoryForm] = useState({});
  const [logo, setLogo] = useState(null);
  const { categoryList, setCategoryList, setRefresh } =
    useContext(CategoriesContext);

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultCategoryForm,
  });

  useEffect(() => {
    if (categoryForm.icon) {
      const iconLoaded = icons.find((icon) => icon.name === categoryForm.icon);

      setSearch(iconLoaded?.label || '');
      setValue('icon', iconLoaded?.name);
    }
  }, [categoryForm.icon]);

  const onHandleCloseModal = () => {
    setCategoryForm({});
    reset(defaultCategoryForm);
    setEditId(null);
    setLogo(null);
    setShowModal(false);
    setSearchOpen(false);
    setSearch('');
  };

  const IconItem = ({ icon }) => {
    return (
      <p
        key={icon.name}
        onClick={() => onHandleSelectIcon(icon)}
        className="cursor-pointer d-flex align-items-center py-2 px-2 mb-0 border-bottom"
      >
        <MaterialIcon
          icon={icon.name}
          clazz="material-icons-outlined font-size-2xl mr-2"
        />
        <span className="font-size-sm">{icon.label}</span>
      </p>
    );
  };

  const onUploadLogo = async () => {
    const form = new FormData();
    form.append('file', await createBlobObject(logo), logo.name);
    const {
      data: {
        data: { id },
      },
    } = await userService.uploadAvatar(form);
    return id;
  };

  const onLoadLogo = async (event) => {
    const target = event.target.files[0];
    setLogo(target);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const apiEvent = editId ? 'UpdateCategory' : 'CreateCategory';
    let documentId = logo?.id || null;
    // lastModified indicates that file is dropped for upload, so upload it first
    // if there is already logo in category then avoid calling upload
    if (logo && logo?.lastModified) {
      // if there is a logo, then first upload it
      documentId = await onUploadLogo();
    }

    const categoryObject = { ...data, id: editId || '', logo: documentId };
    if (!editId) {
      delete categoryObject.id; // null id on create throw error
    }

    await categoryService[apiEvent](categoryObject)
      .then((result) => {
        if (result.errors) {
          onError(result?.errors[0]?.message);
        } else {
          onSuccess(
            editId ? constants.categoryUpdated : constants.categoryCreated
          );
        }
      })
      .catch(() => {
        onError(constants.unexpectedError);
      });

    // find context categories and update logo val against the current loaded category
    const newCategories = [...categoryList];
    const foundCategoryIndex = _.findIndex(newCategories, { id: editId });
    if (foundCategoryIndex > -1) {
      newCategories[foundCategoryIndex].logo = documentId;
      setCategoryList(newCategories);
    }

    onHandleCloseModal();
    reset(defaultCategoryForm);
    setIsLoading(false);
    getCategories(true);

    // this is updating a categories context so that when any category is updated
    // we also trigger an update to refresh call from api for sidemenu navigation
    setRefresh((prevState) => prevState + 1);
  };

  const onHandleSelectIcon = (icon) => {
    setSearch(icon.label);
    setCategoryForm({ ...categoryForm, icon: icon.name });
    setSearchOpen(false);
  };

  const handleIconSearch = (value) => {
    setSearch(value);
    setSearchOpen(true);
    if (!value) {
      setCategoryForm({ ...categoryForm, icon: '' });
      setValue('icon', '');
    }
  };

  const handleChange = (e) => {
    const target = e.target;
    setCategoryForm((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const getUpdateValues = async () => {
    const { id, title, description, logo, icon } =
      await categoryService.GetCategoryById(editId);

    const partnerLogo = logo && (await getLogo(logo));

    if (partnerLogo) {
      setLogo({
        ...partnerLogo,
        name: partnerLogo.filename_download,
        size: partnerLogo.filesize,
      });
    }

    const iconVal = icon || '';
    setCategoryForm({
      id,
      title,
      description,
      logo: partnerLogo,
      icon: iconVal,
    });
    setValue('title', title);
    setValue('description', description);
    setValue('icon', iconVal);
    !icon && setSearch(iconVal);
  };

  useEffect(() => {
    if (editId) {
      getUpdateValues();
    }
  }, [editId]);

  const getLogo = async (documentId) => {
    const response = await userService.getFile(documentId);
    return response?.data;
  };

  useOutsideClickDropDown(dropdownRef, searchOpen, setSearchOpen);

  return (
    <Modal isOpen={showModal} fade={false}>
      <ModalHeader tag="h2" toggle={onHandleCloseModal} className="pb-2">
        {editId ? constants.modalTitle.update : constants.modalTitle.create}
      </ModalHeader>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <ModalBody className="borderline-top">
          <FormGroup>
            <Label for="title">
              Category Name <Asterick />
            </Label>
            <InputValidation
              name="title"
              type="input"
              placeholder="Category Name"
              value={categoryForm.title}
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
              value={categoryForm.description}
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
            <Label>
              Select Icon <Asterick />
            </Label>
            <div ref={dropdownRef}>
              <ControllerValidation
                name="icon"
                errors={errors}
                form={categoryForm}
                control={control}
                validationConfig={{
                  required: { value: true, message: 'Icon is required.' },
                }}
                renderer={({ field }) => (
                  <div
                    dir="ltr"
                    className={`select2-dropdown select2-dropdown--below position-relative`}
                  >
                    <div className="bg-white border border-1 border-primary search-card rounded rounded-2">
                      <div
                        className="select2-search bg-transparent position-relative select2-search--dropdown rounded rounded-2 search-input"
                        onClick={() => setSearchOpen(true)}
                      >
                        <input
                          style={categoryForm?.icon ? { paddingLeft: 45 } : {}}
                          className={`select2-search__field bg-transparent border-0 w-100 form-control py-0 ${
                            errors.icon && !categoryForm.icon
                              ? 'border-danger border'
                              : ''
                          } `}
                          type="search"
                          tabIndex="0"
                          name="icon"
                          {...field}
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck="false"
                          role="searchbox"
                          aria-autocomplete="list"
                          placeholder="Select Icon"
                          aria-controls="select2-4dd5-results"
                          value={search || ''}
                          onChange={(e) => handleIconSearch(e.target.value)}
                        />
                        {categoryForm?.icon && (
                          <MaterialIcon
                            icon={categoryForm.icon}
                            clazz="position-absolute font-size-2xl"
                            style={{ top: 6, left: 10 }}
                          />
                        )}
                      </div>

                      <div
                        style={{ top: 48 }}
                        className={`position-absolute shadow-lg border rounded-lg select2-results ${
                          searchOpen ? '' : 'hs-unfold-hidden'
                        } w-100 bg-white dropdown-icons`}
                      >
                        <div
                          className="select2-results__options list-unstyled"
                          role="listbox"
                          id="select2-4dd5-results"
                          aria-expanded="true"
                          aria-hidden="false"
                        >
                          {icons
                            ?.filter((icon) => {
                              return icon.label
                                .toLowerCase()
                                .includes(search.toLowerCase());
                            })
                            .map((icon) => (
                              <IconItem key={icon.name} icon={icon} />
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <Label for="file">Upload Logo</Label>
            <DragDropUploadFile
              file={logo}
              setFile={setLogo}
              onLoadFile={onLoadLogo}
              preview
              logoId={logo?.id}
              chooseFileText={CHOOSE_IMAGE_FILE}
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
            label={editId ? constants.update : constants.create}
            classnames="btn-sm"
          ></ButtonIcon>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ModalCreateCategory;
