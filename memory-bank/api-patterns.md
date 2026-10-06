# API & Code Quality Patterns (Reference: stepnee-admin)

## Architecture Rules

1. **TanStack Query** for all server state
2. **Zustand** for client-only state (if needed)
3. **Axios singleton class** (HttpService) with interceptors
4. **Co-located `.type.ts`** per API domain
5. **Centralized enums** in one file
6. **Query key factory** in constants

---

## Query Client Config

```typescript
import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/types/api'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: (failureCount, error) => {
        if (error instanceof ApiError) {
          if (error.status >= 400 && error.status < 500 && error.status !== 408 && error.status !== 429) {
            return false
          }
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
})
```

---

## Query Keys Factory

```typescript
// constants/queryKeys.ts
const queryKeys = {
  // Static keys — plain arrays
  articles: ['articles'],
  standings: ['standings'],
  matches: ['matches'],

  // Dynamic keys — factory functions
  articleBySlug: (slug: string) => ['article', slug],
  matchesByDate: (date: string) => ['matches', date],
  teamById: (id: string) => ['team', id],

  // Parameterized with object
  searchResults: (params: ISearchParams) => ['search', params],
}
export default queryKeys
```

---

## API Response Interface

```typescript
// types/api.ts
export interface IApiMeta {
  total?: number
  page?: number
  limit?: number
  totalPages?: number
}

export interface IApiSuccessResponse<T> {
  success: true
  message: string
  data?: T
  meta?: IApiMeta
}

export interface IApiErrorDetails {
  status: number
  title: string
  message: string
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  public status: number
  public title: string
  public code?: string
  public details?: unknown

  constructor(errorDetails: IApiErrorDetails) {
    super(errorDetails.message)
    this.name = 'ApiError'
    this.status = errorDetails.status
    this.title = errorDetails.title
    this.code = errorDetails.code
    this.details = errorDetails.details
  }
}
```

---

## HttpService (Axios Singleton)

```typescript
// services/httpService.ts
class HttpService {
  private readonly axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
    this.setupInterceptors()
  }

  // Typed methods returning IApiSuccessResponse<T>
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>>
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>>
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>>
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>>
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<IApiSuccessResponse<T>>
}

export const httpService = new HttpService(envConfig.apiBaseUrl)
export default httpService
```

---

## API Service Pattern (per domain)

```typescript
// apis/articles/articlesApis.ts
import httpService from '@/services/httpService'
import type { IArticleResponse, ICreateArticlePayload } from './articles.type'

const articlesApis = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) => {
    return httpService.get<IArticleResponse[]>('/articles', { params })
  },
  getById: (slug: string) => {
    return httpService.get<IArticleResponse>(`/articles/${slug}`)
  },
  create: (payload: ICreateArticlePayload) => {
    return httpService.post<IArticleResponse>('/articles', payload)
  },
}
export default articlesApis
```

---

## Type File Pattern (co-located)

```typescript
// apis/articles/articles.type.ts
export interface IArticleResponse {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  category: ArticleCategoryEnum
  coverImage: string
  publishedAt: string
  author: string
}

export interface ICreateArticlePayload {
  title: string
  body: string
  category: ArticleCategoryEnum
  coverImage?: File
}
```

---

## Enums (centralized)

```typescript
// types/enum.ts
export enum ArticleCategoryEnum {
  LIGAPRO = 'ligapro',
  INTERNACIONAL = 'internacional',
  MAS_DEPORTES = 'mas-deportes',
}

export enum MatchStatusEnum {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}
```

---

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Interface | `I` prefix + PascalCase | `IArticleResponse` |
| Payload | `I{Action}Payload` | `ICreateArticlePayload` |
| Enum | PascalCase + `Enum` suffix | `MatchStatusEnum` |
| Query key | camelCase factory | `queryKeys.articleBySlug(slug)` |
| API service | camelCase object | `articlesApis.getAll()` |
| Hook | `use` prefix | `useArticlesQuery()` |
| Type file | `{domain}.type.ts` | `articles.type.ts` |

---

## useQuery Pattern

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: [queryKeys.articles, page, limit, category],
  queryFn: () => articlesApis.getAll({ page, limit, category }),
  placeholderData: prev => prev,
  staleTime: 1000 * 30,
  select: res => res.data,
  enabled: Boolean(category),
})
```

---

## useMutation Pattern

```typescript
const { mutate, isPending } = useMutation({
  mutationFn: (payload: ICreateArticlePayload) => articlesApis.create(payload),
  onSuccess: async (res) => {
    if (res.success) {
      await invalidateQueries([queryKeys.articles])
      showSuccessToast({ title: 'Success', description: res.message })
    }
  },
  onError: (err) => {
    showErrorToast({ title: 'Error', description: err?.message || 'Something went wrong' })
  },
})
```

---

## invalidateQueries Utility

```typescript
// utils/utils.ts
import { queryClient } from '@/config/queryClient'

export const invalidateQueries = async (queryKey: unknown[]) => {
  await queryClient.invalidateQueries({ queryKey })
}
```


Final Code Quality Rules
ES6+ syntax use karna hai.
Interface names I se start honge:
IArticleResponse
ICreateArticlePayload
IUserResponse
Enum names EnumName se start honge:
EnumArticleCategory
EnumMatchStatus
EnumUserRole
any type bilkul use nahi karna hai.
as any bhi strictly avoid karna hai.
Unknown data ke liye unknown + proper type narrowing use karna hai.
TanStack Query → server state ke liye.
Zustand → sirf client-side state ke liye, jab genuinely required ho.
Axios singleton HttpService → all API requests.
Har API domain ke saath co-located {domain}.type.ts.
Centralized enums → types/enum.ts.
Query key factory → centralized constants/queryKeys.ts.
API methods properly typed hone chahiye.
useQuery / useMutation mein proper generics/types use karne hain.
API response ke liye common IApiSuccessResponse<T> / ApiError pattern follow karna hai.
invalidateQueries ke liye centralized utility use karni hai.
No low-quality shortcuts, duplicate API logic, unnecessary state, or weak typing.
console.log, dead code, unused imports, magic strings/numbers, and unnecessary useEffect avoid karna hai.
Existing architecture/pattern ko follow karte hue clean, reusable and maintainable code likhna hai.

Example enum naming ab:

export enum EnumArticleCategory {
  LIGAPRO = 'ligapro',
  INTERNACIONAL = 'internacional',
  MAS_DEPORTES = 'mas-deportes',
}

Aur interface:

export interface IArticleResponse {
  id: string
  title: string
  slug: string
}

any ka use nahi hoga, including as any. Proper TypeScript types/interfaces/type guards use honge.