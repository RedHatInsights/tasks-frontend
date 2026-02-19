import { useGetEntities } from '../hooks';
import { fetchSystems } from '../../../../api';

jest.mock('../../../../api');

describe('useGetEntities', () => {
  let onComplete;
  let setFilterSortString;
  let onError;
  let setFetchError;
  let addNotification;
  let selectedIds;
  let slug;

  beforeEach(() => {
    onComplete = jest.fn();
    setFilterSortString = jest.fn();
    onError = jest.fn();
    setFetchError = jest.fn();
    addNotification = jest.fn();
    selectedIds = [];
    slug = 'test-task';
    jest.clearAllMocks();
  });

  const config = {
    page: 1,
    per_page: 20,
    orderBy: 'display_name',
    orderDirection: 'asc',
    filters: {},
    tags: [],
    workloadFilters: {},
    activeFiltersConfig: {
      filters: [],
    },
  };

  describe('successful fetch', () => {
    it('should reset error state on successful fetch', async () => {
      const mockData = [
        {
          id: '1',
          display_name: 'system1',
          requirements: [],
          connected: true,
          last_check_in: '2024-01-01',
        },
      ];

      fetchSystems.mockResolvedValue({
        data: mockData,
        meta: { count: 1 },
      });

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        onError,
        setFetchError,
        addNotification,
      });

      await getEntities([], config);

      expect(onError).toHaveBeenCalledWith(null);
      expect(setFetchError).toHaveBeenCalledWith(false);
      expect(onComplete).toHaveBeenCalled();
    });
  });

  describe('400 error handling', () => {
    it('should set fetchError to true on 400 error', async () => {
      const error400 = {
        response: {
          status: 400,
          data: { message: 'Bad request' },
        },
        message: 'Bad request from API',
        data: [],
        meta: { count: 0 },
      };

      fetchSystems.mockResolvedValue(error400);

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        onError,
        setFetchError,
        addNotification,
      });

      await getEntities([], config);

      expect(addNotification).toHaveBeenCalledWith({
        variant: 'danger',
        title: 'There was an error fetching systems',
        description: 'Bad request from API',
        dismissable: true,
      });
      expect(onError).toHaveBeenCalledWith(
        'Error fetching systems with given filters'
      );
      expect(setFetchError).toHaveBeenCalledWith(true);
    });

    it('should return empty results on 400 error', async () => {
      const error400 = {
        response: {
          status: 400,
          data: { message: 'Invalid filter' },
        },
        message: 'Invalid filter parameter',
        data: [],
        meta: { count: 0 },
      };

      fetchSystems.mockResolvedValue(error400);

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        onError,
        setFetchError,
        addNotification,
      });

      const result = await getEntities([], config);

      expect(result.results).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('callbacks are optional', () => {
    it('should not throw if onError is not provided', async () => {
      const mockData = [
        {
          id: '1',
          display_name: 'system1',
          requirements: [],
          connected: true,
          last_check_in: '2024-01-01',
        },
      ];

      fetchSystems.mockResolvedValue({
        data: mockData,
        meta: { count: 1 },
      });

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        // onError not provided
        setFetchError,
      });

      await expect(getEntities([], config)).resolves.toBeDefined();
    });

    it('should not throw if setFetchError is not provided', async () => {
      const mockData = [
        {
          id: '1',
          display_name: 'system1',
          requirements: [],
          connected: true,
          last_check_in: '2024-01-01',
        },
      ];

      fetchSystems.mockResolvedValue({
        data: mockData,
        meta: { count: 1 },
      });

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        onError,
        // setFetchError not provided
      });

      await expect(getEntities([], config)).resolves.toBeDefined();
    });

    it('should handle 400 error when callbacks are not provided', async () => {
      const error400 = {
        response: {
          status: 400,
          data: { message: 'Bad request' },
        },
        message: 'Bad request from API',
        data: [],
        meta: { count: 0 },
      };

      fetchSystems.mockResolvedValue(error400);

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        // onError and setFetchError not provided
      });

      const result = await getEntities([], config);

      expect(result.results).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('data transformation', () => {
    it('should correctly map entity data with requirements', async () => {
      const mockData = [
        {
          id: '1',
          display_name: 'system1',
          requirements: ['Requirement 1', 'Requirement 2'],
          connected: true,
          last_check_in: '2024-01-01',
        },
      ];

      fetchSystems.mockResolvedValue({
        data: mockData,
        meta: { count: 1 },
      });

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        onError,
        setFetchError,
        addNotification,
      });

      const result = await getEntities([], config);

      expect(result.results[0].eligibility).toEqual({
        title: 'Not eligible',
        tooltip: 'Requirement 1. Requirement 2',
      });
      expect(result.results[0].disableSelection).toBe(2); // requirements.length (2) is truthy
    });

    it('should correctly map entity data without requirements', async () => {
      const mockData = [
        {
          id: '1',
          display_name: 'system1',
          requirements: [],
          connected: true,
          last_check_in: '2024-01-01',
        },
      ];

      fetchSystems.mockResolvedValue({
        data: mockData,
        meta: { count: 1 },
      });

      const getEntities = useGetEntities(onComplete, {
        selectedIds,
        setFilterSortString,
        slug,
        onError,
        setFetchError,
        addNotification,
      });

      const result = await getEntities([], config);

      expect(result.results[0].eligibility).toEqual({
        title: 'Eligible',
        tooltip: '',
      });
      expect(result.results[0].disableSelection).toBe(false);
    });

    it('should mark selected systems as selected', async () => {
      const mockData = [
        {
          id: '1',
          display_name: 'system1',
          requirements: [],
          connected: true,
          last_check_in: '2024-01-01',
        },
        {
          id: '2',
          display_name: 'system2',
          requirements: [],
          connected: true,
          last_check_in: '2024-01-02',
        },
      ];

      fetchSystems.mockResolvedValue({
        data: mockData,
        meta: { count: 2 },
      });

      const getEntities = useGetEntities(onComplete, {
        selectedIds: ['1'],
        setFilterSortString,
        slug,
        onError,
        setFetchError,
      });

      const result = await getEntities([], config);

      expect(result.results[0].selected).toBe(true);
      expect(result.results[1].selected).toBe(false);
    });
  });
});
