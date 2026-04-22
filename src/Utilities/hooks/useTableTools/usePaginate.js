import React, { useState } from 'react';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';

/**
 * Hook for handling table pagination - supports both client-side and server-side pagination
 *  @param   {object}           options              - Configuration options
 *  @param   {number}           [options.perPage]    - Items per page
 *  @param   {object | boolean} [options.pagination] - Custom pagination config (for server-side) or false to disable
 *  @param   {boolean}          isTableLoading       - Whether table is currently loading
 *  @returns {object}                                Pagination utilities
 */
const usePaginate = (options = {}, isTableLoading) => {
  const { perPage = 10, pagination: customPagination } = options;
  const enablePagination = options?.pagination !== false;

  // Client-side pagination state (always called to satisfy React hooks rules)
  const [paginationState, setPaginationState] = useState({
    perPage,
    page: 1,
  });
  const setPagination = (newState) =>
    setPaginationState({
      ...paginationState,
      ...newState,
    });

  const onSetPage = (_, page) => setPagination({ ...paginationState, page });

  const onPerPageSelect = (_, perPage) => setPagination({ page: 1, perPage });

  const paginator = (items) => {
    const { page, perPage } = paginationState;
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return items.slice(start, end);
  };

  const setPage = (page) => {
    const nextPage = page < 0 ? paginationState.page + page : page;
    setPagination({
      page: nextPage > 0 ? nextPage : 1,
    });
  };

  // If custom pagination is provided (server-side), use it directly
  if (customPagination && typeof customPagination === 'object') {
    return {
      paginator: (items) => items, // No client-side pagination
      setPage: () => {}, // Handled by parent
      toolbarProps: {
        pagination: !isTableLoading ? (
          customPagination
        ) : (
          <Skeleton size={SkeletonSize.lg} />
        ),
      },
    };
  }

  return enablePagination
    ? {
        paginator,
        setPage,
        toolbarProps: {
          pagination: !isTableLoading ? (
            {
              ...paginationState,
              onSetPage,
              onPerPageSelect,
            }
          ) : (
            <Skeleton size={SkeletonSize.lg} />
          ),
        },
      }
    : {};
};

export default usePaginate;
