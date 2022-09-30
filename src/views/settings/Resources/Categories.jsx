import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';

import Alert from '../../../components/Alert/Alert';
import AlertWrapper from '../../../components/Alert/AlertWrapper';
import ModalCreateCategory from '../../../components/modal/ModalCreateCategory.component';
import DeleteCategoryButton from '../../../components/categories/DeleteCategoryButton';
import CategoriesTable from '../../../components/categories/CategoriesTable';
import categoryService from '../../../services/category.service';
import LayoutHead from '../../../components/commons/LayoutHead';
import { sortingTable } from '../../../utils/sortingTable';
import TableSelectedCount from '../../../components/prospecting/v2/common/TableSelectedCount';
import TableSkeleton from '../../../components/commons/TableSkeleton';
import { DataFilters } from '../../../components/DataFilters';
import { SEARCH_CATEGORIES } from '../../../utils/constants';
import DeleteConfirmationModal from '../../../components/modal/DeleteConfirmationModal';
import { useProfileContext } from '../../../contexts/profileContext';
const Categories = () => {
  const defaultPagination = { page: 1, limit: 10 };
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterSelected, setFilterSelected] = useState({});
  const [pagination, setPagination] = useState(defaultPagination);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesToDelete, setCategoriesToDelete] = useState([]);

  const [dataInDB, setDataInDB] = useState(false);
  const [order, setOrder] = useState(['updated_at', 'DESC']);
  const [loading, setLoading] = useState(false);
  const { profileInfo } = useProfileContext();
  const roleInfo = profileInfo?.roleInfo;
  const isAdmin = roleInfo?.admin_access;
  const getCategories = async (count) => {
    setLoading(true);
    const resp = await categoryService.GetCategories(
      { order, ...filterSelected },
      {
        page: pagination.page,
        limit: 10,
      }
    );

    const { data, pagination: dataPagination } = resp || {};
    setCategories(data || []);
    setPagination(dataPagination || defaultPagination);
    setLoading(false);
    if (count) setDataInDB(Boolean(dataPagination.totalPages));
  };

  const changePaginationPage = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    setSelectedCategories([]);
  };

  useEffect(() => {
    getCategories(true);
  }, [pagination?.page, order, filterSelected]);

  const onSuccess = (message) => {
    setSuccessMessage(message);
  };

  const onError = (message) => {
    setErrorMessage(message);
  };

  const handleEdit = (row) => {
    if (isAdmin || (!isAdmin && !row.isPublic)) {
      setEditId(row.id);
      setShowCreateModal(true);
    }
  };

  const handleDelete = (category) => {
    setCategoriesToDelete([category]);
    // only allow deleting if category has 0 lessons and courses
    if (!category.totalLessons && !category.totalCourses) {
      setShowDeleteModal(true);
    } else {
      setErrorMessage(
        'Can’t delete category. Move all Lessons and Courses to another Category before deleting.'
      );
    }
  };

  const handleDeleteCategory = async () => {
    const category = categoriesToDelete[0];
    await categoryService.deleteCategory(category?.id);
    setCategoriesToDelete([]);
    setShowDeleteModal(false);
    getCategoriesLatest();
  };

  const sortTable = ({ name }) => sortingTable({ name, order, setOrder });

  const clearSelection = () => {
    setSelectAll(false);
    setSelectedCategories([]);
  };

  const getCategoriesLatest = () => {
    if (pagination.page !== 1) {
      setPagination(defaultPagination);
    } else {
      getCategories(true);
    }
  };

  return (
    <>
      <AlertWrapper>
        <Alert
          message={errorMessage}
          setMessage={setErrorMessage}
          color="danger"
        />
        <Alert
          message={successMessage}
          setMessage={setSuccessMessage}
          color="success"
        />
      </AlertWrapper>
      <LayoutHead
        onHandleCreate={() => {
          setShowCreateModal(true);
        }}
        buttonLabel={'Add Category'}
        allRegister={`${pagination.count || 0} Categories`}
        orientationDelete
        dataInDB={dataInDB}
      >
        {selectedCategories.length > 0 && (
          <TableSelectedCount
            list={selectedCategories}
            containerPadding="pr-3"
            btnClick={selectedCategories}
            btnClass="btn-sm text-white"
            btnIcon="add"
            btnLabel="Delete"
            btnColor="success"
            onClear={clearSelection}
            customButton={
              <DeleteCategoryButton
                setSelectedCategories={setSelectedCategories}
                selectedCategories={selectedCategories}
                getCategories={getCategories}
                categories={categories}
                clearSelection={clearSelection}
              />
            }
          />
        )}
      </LayoutHead>
      <div className="row justify-content-center">
        <div className="col-lg-12">
          <Card className="mb-5">
            <Card.Header>
              <DataFilters
                filterSelected={filterSelected}
                setFilterSelected={setFilterSelected}
                searchPlaceholder={SEARCH_CATEGORIES}
                paginationPage={pagination}
                setPaginationPage={setPagination}
              />
            </Card.Header>
            <Card.Body className="p-0">
              {loading && <TableSkeleton cols={4} rows={10} />}

              {!loading && (
                <CategoriesTable
                  dataSource={categories}
                  paginationInfo={pagination}
                  onPageChange={changePaginationPage}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  dataInDB={dataInDB}
                  setShowCreateModal={setShowCreateModal}
                  sortingTable={sortTable}
                  selectAll={selectAll}
                  setSelectAll={setSelectAll}
                />
              )}
            </Card.Body>
          </Card>
        </div>

        <ModalCreateCategory
          showModal={showCreateModal}
          setShowModal={setShowCreateModal}
          onSuccess={onSuccess}
          onError={onError}
          editId={editId}
          setEditId={setEditId}
          getCategories={getCategoriesLatest}
        />

        <DeleteConfirmationModal
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          setSelectedCategories={setCategoriesToDelete}
          event={handleDeleteCategory}
          itemsConfirmation={categoriesToDelete}
          itemsReport={[]}
        />
      </div>
    </>
  );
};

export default Categories;
