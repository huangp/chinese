import axios from "axios"
import {apiHandler, apiScore} from "./api";
import {Score} from "../app";

export interface UpdateScores {
    scores: Score[]
    phrases: string[]
}

export const saveUserScore = async (username: string, scores: Score[], phrases: string[]) : Promise<Score[]> => {
    console.info("saving...", scores)
    const updateScores: UpdateScores = {
        scores,
        phrases
    }
    const response = await axios.post(`${apiScore}/user/${username}`, updateScores, {withCredentials: true})
    return apiHandler(response)
}

// cached type in localStorage
interface UserScores {
    user: string;
    scores: Score[];
}

export const saveScoresToLocalStorage = (username: string, scores: Score[]): Promise<Score[]> => {
    localStorage.setItem(username, JSON.stringify({username, scores}))
    return Promise.resolve(scores)
}
export const getScoresByUserFromLocalStorage = (user: string): Score[] => {
    const cache = localStorage.getItem(user);
    if (cache) {
        const userScore = JSON.parse(cache) as UserScores
        return userScore.scores
    } else {
        return []
    }
}

export const clearUserScoresInLocalStorage = (username: string): Promise<void> => {
    localStorage.removeItem(username)
    return Promise.resolve()
}