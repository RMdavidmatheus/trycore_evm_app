import type { ApiErrorResponseDto } from "../../application/dtos/evm.dto"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"

export class ApiClientError extends Error {
  public readonly status: number
  public readonly errorTitle: string
  public readonly validationErrors?: Record<string, string>

  constructor(payload: ApiErrorResponseDto) {
    super(payload.message || "Error al comunicarse con el servidor")
    this.name = "ApiClientError"
    this.status = payload.status
    this.errorTitle = payload.error
    this.validationErrors = payload.validationErrors
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiErrorResponseDto | null = null
    try {
      errorData = (await response.json()) as ApiErrorResponseDto
    } catch {
    }

    if (errorData) {
      throw new ApiClientError(errorData)
    }

    throw new ApiClientError({
      status: response.status,
      error: response.statusText || "HTTP Error",
      message: `Error HTTP ${response.status} al consumir el servicio`,
      path: response.url,
      timestamp: new Date().toISOString(),
    })
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const httpClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })
    return handleResponse<T>(response)
  },

  async post<T, B>(endpoint: string, body: B): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
  },

  async put<T, B>(endpoint: string, body: B): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    return handleResponse<T>(response)
  },

  async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return handleResponse<void>(response)
  },
}
