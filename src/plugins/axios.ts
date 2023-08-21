import axios from 'axios'
import type {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
} from 'axios'

// Full config:  https://github.com/axios/axios#request-config
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8'
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common.Pragma = 'no-cache'
// axios.defaults.headers.common['Cache-Control'] = 'no-cache'

const service: AxiosInstance = axios.create({
  timeout: 60 * 100, // Timeout
})

export interface Result<T = any> {
  code: number
  message: string
  data?: T
}

service.interceptors.request.use(
  (config) => {
    return config
  },
  (error: AxiosError) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // Do something with response data
    const { code = 0 }: Result = response.data
    // 只处理接口参数正常数据
    if (code !== 0) {
      return Promise.reject(response.data)
    }
    return response.data
  },
  (error: AxiosError) => {
    // Do something with response error
    return Promise.reject(error)
  }
)

/* 导出封装的请求方法 */
export const $http = {
  get<T = Result>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.get(url, config)
  },

  post<T = any>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.post(url, data, config)
  },

  put<T = Result>(
    url: string,
    data?: object,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return service.put(url, data, config)
  },

  delete<T = Result>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return service.delete(url, config)
  },
}
