import fetchSWR from "swr";
import api from "@/services/api";
import type { AxiosError } from "axios";
import type { KeyedMutator, SWRConfiguration } from "swr";

interface IResponse<T> {
  response: T;
  error: AxiosError;
  isLoading: boolean;
  mutate: KeyedMutator<T>;
}

export function useSWR<T extends object, P = object>(
  key?: string,
  params?: P,
  config?: SWRConfiguration
): IResponse<T> {
  const urlParams = params ? new URLSearchParams(params) : "";
  const fullURL = `${key}?${urlParams}`;

  const fetcher = async () => {
    if (!key) return;
    const response = await api.get(fullURL);
    return response.data;
  };

  const mergedConfig = { revalidateOnFocus: false, ...config };

  const { data: response, error, isLoading, mutate } = fetchSWR(fullURL, fetcher, mergedConfig);

  return { response, error, isLoading, mutate };
}
