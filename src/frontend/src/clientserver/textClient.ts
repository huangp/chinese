import axios, {AxiosResponse} from "axios"
import {apiHandler, apiText} from "./api";


export const checkText = async (username: string, content: string): Promise<CheckTextResponse> => {
    const phrases = content.split("\n");
    console.info(`checking text against ${username}`, phrases);


    const response = await axios.post(`${apiText}/check/${username}`, phrases, {withCredentials: true})
    return apiHandler<CheckTextResponse>(response)
}

export type CheckTextResponse = {
    phrases: string[];
    known: string[];
    total: number;
    unknownCount: number;
}