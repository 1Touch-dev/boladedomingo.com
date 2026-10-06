import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";
import { envConfig } from "@/config/env";
import { ApiError, type IApiErrorDetails, type IApiSuccessResponse } from "@/types/api";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  const axiosError = error as AxiosError;
  const status = axiosError.response?.status ?? 0;
  const data = axiosError.response?.data;
  let message = axiosError.message || "Request failed";
  let code: string | undefined;
  let details: unknown;

  if (isRecord(data)) {
    if (typeof data.message === "string" && data.message) message = data.message;
    if (typeof data.code === "string") code = data.code;
    details = data.details;
  }

  const errorDetails: IApiErrorDetails = {
    status,
    title: axiosError.response?.statusText || "Request failed",
    message,
    code,
    details,
  };

  return new ApiError(errorDetails);
};

class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    this.setupInterceptors();
  }

  private readonly setupInterceptors = (): void => {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: unknown) => Promise.reject(toApiError(error)),
    );
  };

  get = async <T>(url: string, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>> => {
    const response = await this.axiosInstance.get<IApiSuccessResponse<T>>(url, config);
    return response.data;
  };

  post = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>> => {
    const response = await this.axiosInstance.post<IApiSuccessResponse<T>>(url, data, config);
    return response.data;
  };

  put = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>> => {
    const response = await this.axiosInstance.put<IApiSuccessResponse<T>>(url, data, config);
    return response.data;
  };

  patch = async <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>> => {
    const response = await this.axiosInstance.patch<IApiSuccessResponse<T>>(url, data, config);
    return response.data;
  };

  delete = async <T>(url: string, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>> => {
    const response = await this.axiosInstance.delete<IApiSuccessResponse<T>>(url, config);
    return response.data;
  };
}

export const httpService = new HttpService(envConfig.apiBaseUrl);
export default httpService;
