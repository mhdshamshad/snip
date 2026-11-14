import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_STATUS = 'all';

const NO_CUSTOM_PARAMS: readonly CustomParamConfig[] = [];

export interface CustomParamConfig {
  key: string;
  defaultValue?: string | number | null;
  parser?: (value: string) => unknown;
}

export type ParamUpdates = Record<string, string | number | null | undefined>;

export interface StandardFilterParams {
  page: number;
  limit: number;
  search: string;
  status: string;
  updateParams: (updates: ParamUpdates) => void;
}

const toInt = (value: string | null | undefined, fallback: number): number => {
  const parsed = parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizePage = (value: unknown): number => {
  return Math.max(Math.trunc(Number(value)) || DEFAULT_PAGE, DEFAULT_PAGE);
};

const normalizeLimit = (value: unknown): number => {
  return Math.min(Math.max(Math.trunc(Number(value)) || DEFAULT_LIMIT, 1), MAX_LIMIT);
};

export function useUrlFilterParams<
  TCustom extends Record<string, unknown> = Record<string, unknown>,
>(customParams: readonly CustomParamConfig[] = NO_CUSTOM_PARAMS): StandardFilterParams & TCustom {
  const [searchParams, setSearchParams] = useSearchParams();

  const filterState = useMemo(() => {
    const standard = {
      page: normalizePage(toInt(searchParams.get('page'), DEFAULT_PAGE)),
      limit: normalizeLimit(toInt(searchParams.get('limit'), DEFAULT_LIMIT)),
      search: searchParams.get('search') ?? '',
      status: searchParams.get('status') ?? DEFAULT_STATUS,
    };

    const custom = customParams.reduce<Record<string, unknown>>(
      (acc, { key, parser, defaultValue }) => {
        const raw = searchParams.get(key);
        acc[key] = raw !== null ? (parser ? parser(raw) : raw) : (defaultValue ?? null);
        return acc;
      },
      {}
    );

    return { ...standard, ...custom } as Omit<StandardFilterParams, 'updateParams'> & TCustom;
  }, [searchParams, customParams]);

  const updateParams = useCallback(
    (updates: ParamUpdates) => {
      setSearchParams(
        prev => {
          const next = new URLSearchParams(prev);

          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === undefined || value === '') {
              next.delete(key);
              continue;
            }

            if (key === 'page') {
              const page = normalizePage(value);
              if (page === DEFAULT_PAGE) {
                next.delete('page');
              } else {
                next.set('page', String(page));
              }
              continue;
            }

            if (key === 'limit') {
              const limit = normalizeLimit(value);
              if (limit === DEFAULT_LIMIT) {
                next.delete('limit');
              } else {
                next.set('limit', String(limit));
              }
              continue;
            }

            if (key === 'status' && value === DEFAULT_STATUS) {
              next.delete('status');
              continue;
            }

            next.set(key, String(value));
          }

          let nonPageValueChanged = false;
          for (const key of Object.keys(updates)) {
            if (key === 'page') {
              continue;
            }

            const prevVal = prev.get(key) ?? '';
            const nextVal = next.get(key) ?? '';
            if (prevVal !== nextVal) {
              nonPageValueChanged = true;
              break;
            }
          }

          const touchesPage = 'page' in updates;
          if (nonPageValueChanged && !touchesPage) {
            next.delete('page');
          }

          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return { ...filterState, updateParams };
}
