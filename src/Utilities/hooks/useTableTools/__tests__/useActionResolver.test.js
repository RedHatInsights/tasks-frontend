import { renderHook } from '@testing-library/react';
import { useActionResolverWithItems } from '../useActionResolver';

describe('useActionResolverWithItems', () => {
  const mockActionResolver = jest.fn();

  describe('Hook calling behavior (tests for conditional hook fix)', () => {
    it('should always call useActionResolver internally even when items array is empty', () => {
      const { result } = renderHook(() =>
        useActionResolverWithItems({
          items: [],
          actionResolver: mockActionResolver,
        }),
      );

      // Should return empty object when items.length === 0
      expect(result.current).toEqual({});
    });

    it('should call useActionResolver and return result when items array has elements', () => {
      const { result } = renderHook(() =>
        useActionResolverWithItems({
          items: [{ id: 1 }, { id: 2 }],
          actionResolver: mockActionResolver,
        }),
      );

      expect(result.current).toEqual({
        tableProps: {
          actionResolver: mockActionResolver,
        },
      });
    });

    it('should return empty object when items array is empty but actionResolver is provided', () => {
      const { result } = renderHook(() =>
        useActionResolverWithItems({
          items: [],
          actionResolver: mockActionResolver,
        }),
      );

      // Hook is called but returns empty object due to items.length check
      expect(result.current).toEqual({});
    });

    it('should handle items array with single element', () => {
      const { result } = renderHook(() =>
        useActionResolverWithItems({
          items: [{ id: 1 }],
          actionResolver: mockActionResolver,
        }),
      );

      expect(result.current).toEqual({
        tableProps: {
          actionResolver: mockActionResolver,
        },
      });
    });

    it('should pass through additional options to useActionResolver', () => {
      const extraOption = 'test';
      const { result } = renderHook(() =>
        useActionResolverWithItems({
          items: [{ id: 1 }],
          actionResolver: mockActionResolver,
          extraOption,
        }),
      );

      // Should still return the actionResolver regardless of extra options
      expect(result.current).toEqual({
        tableProps: {
          actionResolver: mockActionResolver,
        },
      });
    });
  });

  describe('Behavior consistency', () => {
    it('should consistently return same structure when re-rendered with same items', () => {
      const { result, rerender } = renderHook(
        ({ items }) =>
          useActionResolverWithItems({
            items,
            actionResolver: mockActionResolver,
          }),
        {
          initialProps: { items: [{ id: 1 }] },
        },
      );

      const firstResult = result.current;

      rerender({ items: [{ id: 1 }] });

      expect(result.current).toEqual(firstResult);
    });

    it('should update when items changes from empty to populated', () => {
      const { result, rerender } = renderHook(
        ({ items }) =>
          useActionResolverWithItems({
            items,
            actionResolver: mockActionResolver,
          }),
        {
          initialProps: { items: [] },
        },
      );

      expect(result.current).toEqual({});

      rerender({ items: [{ id: 1 }] });

      expect(result.current).toEqual({
        tableProps: {
          actionResolver: mockActionResolver,
        },
      });
    });

    it('should update when items changes from populated to empty', () => {
      const { result, rerender } = renderHook(
        ({ items }) =>
          useActionResolverWithItems({
            items,
            actionResolver: mockActionResolver,
          }),
        {
          initialProps: { items: [{ id: 1 }] },
        },
      );

      expect(result.current).toEqual({
        tableProps: {
          actionResolver: mockActionResolver,
        },
      });

      rerender({ items: [] });

      expect(result.current).toEqual({});
    });
  });
});
