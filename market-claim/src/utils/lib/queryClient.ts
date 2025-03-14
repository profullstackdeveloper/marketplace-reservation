import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { APIInstance } from "..";
import { AxiosInstance, AxiosResponse } from "axios";

const apiClient = new APIInstance(import.meta.env.VITE_API_URL as string).getInstance();

async function throwIfResNotOk(res: AxiosResponse) {
  if (res.status !== 200 ) {
    if (res.status !== 201) {
        const text = res.statusText;
        throw new Error(`${res.status}: ${text}`);
    }
  }
}

export async function apiRequest(
  method: string,
  url: string,
  params?: unknown | undefined,
  data?: unknown | undefined
): Promise<AxiosResponse> {
    let key: keyof AxiosInstance = 'get'
    if (String(method).toLowerCase() === 'post') {
        key = 'post'
    }
  const res = await apiClient[key](url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    params,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk({
        status: res.status,
        statusText: res.statusText,
    } as AxiosResponse);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
