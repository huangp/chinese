import axios, {AxiosResponse} from "axios"
import {apiHandler, apiUser} from "./api";
import {User} from "../app";

export const getUsers = async (): Promise<Array<User>> => {
    const response = await axios.get<Array<User>, AxiosResponse<Array<User>>>(apiUser, {withCredentials: true})
    return apiHandler<User[]>(response)
}