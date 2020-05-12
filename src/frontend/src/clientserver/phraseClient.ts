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

export const getAllCharacters = async (): Promise<string[]> => {
    console.debug("=== getting all characters ===")

    const response = await axios.get(`${apiPhrase}/allcharacters`, {withCredentials: true})
    return apiHandler<string[]>(response)
}

let page = 0
export const getNextSetOfPhrases = async (): Promise<string[]> => {
    console.debug("=== getting next set of phrase ===")
    // clear local cache
    localStorage.clear()

    const response = await axios.get(`${apiPhrase}/next?page=${page}`, {withCredentials: true})
    page += 1
    return apiHandler<string[]>(response)
}