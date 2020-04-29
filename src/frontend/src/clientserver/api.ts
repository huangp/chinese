import {AxiosResponse} from "axios";

export const apiBaseUrl = 'http://localhost:8080/api'

export const apiUser = `${apiBaseUrl}/user`
export const apiPhrase = `${apiBaseUrl}/phrase`
export const apiScore = `${apiBaseUrl}/score`

export const apiHandler = <T>(response: AxiosResponse<T>,
                              handleOk: (response) => T = response => response.data,
                              handleError: (response: AxiosResponse<T>) => any = response => new Error(JSON.stringify(response))): Promise<T | any> => {
    if (response.status < 400) {
        return Promise.resolve(handleOk(response))
    } else {
        console.warn(`abnormal response status: ${response.status} - ${response.statusText}`, response)
        return Promise.reject(handleError(response))
    }
}