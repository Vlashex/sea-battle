async function delay(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

export interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export class HttpClient {
  async request<T>(
    url: string, 
    options: RequestOptions = {}, 
    retries = 3, 
    delayMs = 500
  ): Promise<T> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch("http://localhost:3000"+url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!res.ok) {
          if (res.status >= 500 && attempt < retries) {
            await delay(delayMs * attempt);
            continue;
          }
          throw new Error(`Server error ${res.status}`);
        }

        return await res.json();
      } catch (e) {
        if (attempt < retries) {
          await delay(delayMs * attempt);
        } else {
          throw e;
        }
      }
    }
    throw new Error('Request failed');
  }
}