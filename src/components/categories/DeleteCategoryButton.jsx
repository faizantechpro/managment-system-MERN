import React, { useState, useEffect } from 'react';

import categoryService from '../../services/category.service';
import DeleteConfirmationModal from '../modal/DeleteConfirmationModal';

const DeleteCategoryButton = ({
  setSelectedCategories,
  selectedCategories,
  getCategories,
  categories,
  clearSelection = () => {},
}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemsConfirmation, setItemsConfirmation] = useState([]);
  const [itemsReport, setItemsReport] = useState([]);

  const deleteCategories = () => {
    const deletedCategories = selectedCategories.map(async (category) => {
      return new Promise((resolve) => {
        categoryService
          .deleteCategory(category)
          .then(() => {
            resolve({ isDeleted: true, id: category });
          })
          .catch(() => {
            resolve({ isDeleted: false, id: category });
          });
      });
    });
    return Promise.all(deletedCategories);
  };

  const handleDelete = async () => {
    const result = await deleteCategories();
    const reportItems = itemsConfirmation.map((item) => {
      return {
        ...item,
        ...result.find(
          (resultItem) => String(resultItem.id) === String(item.id)
        ),
      };
    });

    setItemsReport(reportItems);
    getCategories(true);
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const selectedCategoriesdata = selectedCategories.map((categoryId) => {
        return categories.find(
          (category) => String(category.id) === categoryId
        );
      });
      setItemsConfirmation(selectedCategoriesdata);
    }
  }, [selectedCategories]);

  return (
    <>
      <DeleteConfirmationModal
        showModal={showConfirmationModal}
        setShowModal={setShowConfirmationModal}
        setSelectedCategories={setSelectedCategories}
        clearSelection={clearSelection}
        event={handleDelete}
        itemsConfirmation={itemsConfirmation}
        itemsReport={itemsReport}
      />
      <button
        className="btn btn-outline-danger btn-sm"
        onClick={() => {
          setItemsReport([]);
          setShowConfirmationModal(true);
        }}
      >
        <span className="material-icons-outlined">delete</span>
        Delete
      </button>
    </>
  );
};

export default DeleteCategoryButton;
