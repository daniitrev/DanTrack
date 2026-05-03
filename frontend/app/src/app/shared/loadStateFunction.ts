import { catchError, defer, finalize, Observable, of, tap } from 'rxjs';

export interface HttpEntity<T> {
  data: T;
  loading: boolean;
  error: null | string;
}

export function loadStateEntity$<TData, TResponse = TData>(opts: {
  patchSlice: (updater: (slice: HttpEntity<TData>) => HttpEntity<TData>) => void;
  fetch$: () => Observable<TResponse>;
  mapData?: (response: TResponse) => TData;
  mapError?: (err: unknown) => string;
  onStart?: () => void;
  onEnd?: () => void;
  onSuccess?: (res: TResponse) => void;
}) {
  const mapError =
    opts.mapError ??
    ((err: unknown) =>
      `Не удалось загрузить данные, ${err instanceof Error ? err.message : String(err)}`);
  const mapData = opts.mapData ?? ((response: TResponse) => response as unknown as TData);

  return defer(() => {
    opts.onStart?.();
    opts.patchSlice((s) => ({ ...s, loading: true, error: null }));

    return opts.fetch$().pipe(
      tap({
        next: (resp) => {
          const data = mapData(resp);
          opts.patchSlice((s) => ({
            ...s,
            data,
            error: null,
          }));
          opts.onSuccess?.(resp);
        },
      }),
      catchError((err) => {
        opts.patchSlice((s) => ({
          ...s,
          error: mapError(err),
        }));
        return of(null);
      }),
      finalize(() => {
        opts.patchSlice((s) => ({ ...s, loading: false }));
        opts.onEnd?.();
      }),
    );
  });
}
