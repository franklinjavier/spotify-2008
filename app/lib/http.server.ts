import axios, { type AxiosError } from 'axios'

export const api = axios.create()
export const http = axios.create()

api.interceptors.response.use(null, responseInterceptor)
http.interceptors.response.use(null, responseInterceptor)

export function handleError(err: AxiosError) {
  const error = err.response?.data || { message: err.message }
  logError(JSON.stringify(error))
  return { error }
}

export function headers(accessToken: string) {
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
}

export type ActionError = {
  error?: {
    message?: string
  }
}

export { AxiosError as ApiError }

function logError(message: string) {
  console.error(`\u001b[31m${message}\u001b[0m`)
}

function responseInterceptor(error: AxiosError) {
  logError(
    `${error.response?.config?.method?.toLocaleUpperCase()} ${error.response?.config.url} ${error.response
      ?.status} ${JSON.stringify(error.response?.data)}`,
  )
  return Promise.reject(error)
}
