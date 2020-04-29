import axios, {AxiosResponse} from "axios"
import {apiHandler, apiPhrase} from "./api";

export const getPhrases = async (): Promise<string[]> => {
    console.debug("=== getting phrase ===")
    // clear local cache
    localStorage.clear()

    const response = await axios.get(`${apiPhrase}/recent`, {withCredentials: true})
    return apiHandler<string[]>(response)
}

export const addPhrase = async (content: string): Promise<void> => {
    const payload = {content}
    const response = await axios.post(`${apiPhrase}`, payload, {withCredentials: true})
    return apiHandler<void>(response)
}