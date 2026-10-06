export interface IApiMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IApiSuccessResponse<T> {
  success: true;
  message: string;
  data?: T;
  meta?: IApiMeta;
}

export interface IApiErrorDetails {
  status: number;
  title: string;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ISearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export class ApiError extends Error {
  public status: number;
  public title: string;
  public code?: string;
  public details?: unknown;

  constructor(errorDetails: IApiErrorDetails) {
    super(errorDetails.message);
    this.name = "ApiError";
    this.status = errorDetails.status;
    this.title = errorDetails.title;
    this.code = errorDetails.code;
    this.details = errorDetails.details;
  }
}
