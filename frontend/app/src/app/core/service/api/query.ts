import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BuildQuery {
  buildQuery(params: Record<string, string | undefined>) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value) {
        searchParams.set(key, value);
      }
    }

    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }
}
