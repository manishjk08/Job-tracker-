
import { useEffect } from 'react';

import { 
  getApplications, 
  setPage, 
  setStatusFilter,
  setLimit,
  resetFilters 
} from '../features/applicationSlice';
import { useAppDispatch, useAppSelector } from '../app/hook';

interface UseApplicationsOptions {
  autoFetch?: boolean;
}

export const useApplications = (options: UseApplicationsOptions = { autoFetch: true }) => {
  const dispatch = useAppDispatch();
  
  const { 
    applications, 
    loading, 
    error, 
    pagination,
    filters 
  } = useAppSelector((state) => state.applications);

  const fetchApplications = () => {
    dispatch(getApplications({
      status: filters.status,
      page: pagination.currentPage,
      limit: pagination.limit
    }));
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      dispatch(setPage(page));
    }
  };

  const changeStatusFilter = (status: string) => {
    dispatch(setStatusFilter(status));
  };

  const changeLimit = (limit: number) => {
    dispatch(setLimit(limit));
  };

  const clearFilters = () => {
    dispatch(resetFilters());
  };

  useEffect(() => {
    if (options.autoFetch) {
      fetchApplications();
    }
  }, [pagination.currentPage, filters.status, pagination.limit]);

  return {
    applications,
    loading,
    error,
    pagination,
    filters,
    fetchApplications,
    changePage,
    changeStatusFilter,
    changeLimit,
    clearFilters
  };
};