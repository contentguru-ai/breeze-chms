/** Allowed query-parameter value types (undefined/null entries are silently skipped). */
type ParamValue = string | number | boolean | null | undefined;

/** Shape of a Breeze API error response. */
export interface BreezeApiError {
  success: false;
  errors: string[];
}

/**
 * Type-assertion that throws a human-readable error when the Breeze API returns
 * `{ success: false, errors: [...] }` instead of the expected payload.
 *
 * After this call TypeScript narrows `data` away from `unknown`.
 */
export function assertBreezeSuccess(data: unknown): asserts data is Record<string, unknown> {
  if (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as BreezeApiError).success === false
  ) {
    const errors = (data as BreezeApiError).errors;
    throw new Error(errors[0] ?? 'Unknown Breeze API error');
  }
}

/**
 * Minimal HTTP client built on the global `fetch` API (available since Node 18).
 * Replaces the `axios` dependency so no third-party networking code is needed at runtime.
 */
export class BreezeHttpClient {
  private readonly baseUrl: URL;
  private readonly headers: Record<string, string>;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = new URL(baseUrl);
    this.headers = { 'Api-Key': apiKey };
  }

  /** Issue an HTTP GET request and return the parsed JSON body. */
  async get<T = unknown>(
    path: string,
    // Allow any plain-object params to remain compatible with existing typed param interfaces
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options?: { params?: Record<string, any> },
  ): Promise<{ data: T }> {
    // Resolve path against baseUrl (baseUrl MUST end with '/')
    const url = new URL(path, this.baseUrl);

    if (options?.params) {
      for (const [key, value] of Object.entries(options.params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value as ParamValue));
        }
      }
    }

    const response = await fetch(url, { method: 'GET', headers: this.headers });

    if (!response.ok) {
      throw new Error(`Request failed with status code ${response.status}`);
    }

    const data = (await response.json()) as T;
    return { data };
  }
}
