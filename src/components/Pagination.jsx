import React from 'react';
import {
  Pagination as BPagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap';
import { v4 as uuidv4 } from 'uuid';

const PagesItem = ({ currentPage, page, onPageChange }) => {
  return (
    <PaginationItem key={currentPage} active={page === currentPage}>
      <PaginationLink
        onClick={() => {
          onPageChange(currentPage);
        }}
      >
        {currentPage}
      </PaginationLink>
    </PaginationItem>
  );
};

/**
 * Pagination
 * @param {paginationInfo} paginationInfo
 */
const Pagination = ({ paginationInfo, onPageChange }) => {
  const { page = 1, totalPages = 1, maxItem = 5 } = paginationInfo || {};

  const dividerPag = maxItem / 2;
  const fixTotalPages = Math.round(totalPages);

  const startPaginations =
    fixTotalPages > maxItem && page >= dividerPag
      ? dividerPag - 1
      : page < dividerPag
      ? 1
      : fixTotalPages;

  const startToendValidation =
    page + maxItem < fixTotalPages ? page + startPaginations : fixTotalPages;

  const endPaginationValid = page > dividerPag ? startToendValidation : maxItem;

  const endPagination =
    fixTotalPages > maxItem ? endPaginationValid : fixTotalPages;

  const totalPagesArray = [...Array(Math.round(endPagination)).keys()];

  const renderPaginationitems = () =>
    totalPagesArray?.map((item) => {
      const currentPage = item + 1;

      const dividerPag = maxItem / 2;

      if (page <= dividerPag && currentPage <= maxItem) {
        return (
          <PagesItem
            key={uuidv4()}
            currentPage={currentPage}
            page={page}
            onPageChange={onPageChange}
          />
        );
      } else if (
        page > dividerPag &&
        page <= totalPages - dividerPag &&
        currentPage > page - dividerPag &&
        currentPage < page + dividerPag
      ) {
        return (
          <PagesItem
            key={uuidv4()}
            currentPage={currentPage}
            page={page}
            onPageChange={onPageChange}
          />
        );
      } else if (
        page > totalPages - dividerPag &&
        currentPage > totalPages - maxItem
      ) {
        return (
          <PagesItem
            key={uuidv4()}
            currentPage={currentPage}
            page={page}
            onPageChange={onPageChange}
          />
        );
      }
      return [];
    });

  return (
    <BPagination aria-label="Page navigation example">
      {page !== 1 && (
        <PaginationItem disabled={page === 1}>
          <PaginationLink
            onClick={() => {
              onPageChange(page - 1);
            }}
          >
            Prev
          </PaginationLink>
        </PaginationItem>
      )}

      {renderPaginationitems()}

      {page < totalPages && (
        <PaginationItem disabled={page === totalPages}>
          <PaginationLink
            onClick={() => {
              onPageChange(page + 1);
            }}
          >
            Next
          </PaginationLink>
        </PaginationItem>
      )}
    </BPagination>
  );
};

export default Pagination;
