
type ClientOptions = {
  body?: any;
  params?: Record<string, any>;
} & Omit<RequestInit, 'body'>; 

export async function client(path: string, options: ClientOptions = {}) {
  const { body, params, method, ...customConfig } = options;

  const url = new URL(`/api/${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const config: RequestInit = {
    method: method ?? (body ? 'POST' : 'GET'), 
    headers: {
      'Content-Type': 'application/json',
      ...customConfig.headers,
    },
    ...customConfig,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), config);


  const contentType = response.headers.get('content-type');

  if (!response.ok) {
    const errorData = contentType?.includes('application/json') 
      ? await response.json() 
      : { message: `Request failed with status: ${response.statusText}` };
    throw new Error(errorData.message || 'An API error occurred');
  }

  if (!contentType || !contentType.includes('application/json')) {
    throw new Error("MSW interception failed: Received a non-JSON response. This is a development-only error.");
  }


  if (response.status === 204) {
    return;
  }
  return response.json();
}