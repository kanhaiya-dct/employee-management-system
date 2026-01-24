export const API_URL = "http://localhost:5000/api";

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    cache: options.cache || 'no-store', // Default to no-store for dynamic data
  });

  if (!res.ok) {
     try {
        const errorData = await res.json();
        throw new Error(errorData.error || `API Error: ${res.status}`);
     } catch (e: any) {
        throw new Error(e.message || `API Error: ${res.status}`);
     }
  }
  
  // Return json if content type is json, else text
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return res.json();
  }
  return res.text();
}
