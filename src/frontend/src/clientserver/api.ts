import {AxiosResponse} from "axios";

// console.info("=== process env", BACKEND_URL)

declare var BACKEND_URL: string

const backendUrl= BACKEND_URL

export const apiBaseUrl = `${backendUrl}/api`

export const apiUser = `${apiBaseUrl}/user`
export const apiPhrase = `${apiBaseUrl}/phrase`
export const apiScore = `${apiBaseUrl}/score`

export const apiText = `${apiBaseUrl}/text`

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