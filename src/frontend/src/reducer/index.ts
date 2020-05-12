import {Score, User} from "../app";
import {
    ActionTypes, GET_NEW_PHRASES_FAILURE, GET_NEW_PHRASES_REQUEST, GET_NEW_PHRASES_SUCCESS,
    MARK_SCORE,
    NEXT_PHRASE,
    SELECT_CHARACTER, SWITCH_USER
} from "../action/types";
import {getScoresByUserFromLocalStorage} from "../clientserver/scoreClient";
import {nextPhrase} from "../clientserver/phraseService";
import {errorHandler} from "../utils";

export interface State {
    loading: boolean,
    message: undefined | string | Error,
    phrases: string[],
    users: User[],
    currentUsername: string,
    scores: Score[],
    selected: string[],
    phrase: string
}

export const initialState: State = {
    loading: false,
    message: undefined,
    phrases: [],
    users: [],
    currentUsername: undefined,
    scores: [],
    selected: [],
    phrase: ''
}

const updateSelect = (selected: string[], char: string): string[] => {
    const copy = [...selected]
    const index = selected.indexOf(char)
    if (index < 0) {
        copy.push(char)
    } else if (index >= 0) {
        copy.splice(index, 1)
    }
    return copy
}

export const rootReducer = (state: State = initialState, action: ActionTypes) => {
    switch (action.type) {
        case SELECT_CHARACTER:
            const character = action.payload.character
            const selected = state.selected
            const updated = updateSelect(selected, character);
            return {
                ...state,
                selected: updated
            }
        case MARK_SCORE:
            // saving current scores is done in middleware
            const scoresForPhrase = action.payload.scoresForPhrase
            const totalScores = state.scores
            const map = {}
            totalScores.forEach(s => {
                map[s.character] = s
            })
            scoresForPhrase.forEach(score => {
                const value = map[score.character]
                if (value) {
                    const existingScore = value as Score;
                    existingScore.correct += score.correct
                    existingScore.incorrect += score.incorrect
                } else {
                    map[score.character] = score
                }
            })
            const updatedTotalScores = Object.keys(map).map(k => map[k])

            return {
                ...state,
                scores: updatedTotalScores,
                selected: [],
                phrase: nextPhrase(state.phrases)
            }
        case NEXT_PHRASE:
            const next = nextPhrase(state.phrases)
            return {
                ...state,
                selected: [],
                phrase: next
            }
        case SWITCH_USER:
            //
            const user = action.payload.user
            const scores = getScoresByUserFromLocalStorage(user.username)
            return {
                ...state,
                scores,
                currentUsername: user.username,
                selected: []
            }
        case GET_NEW_PHRASES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case GET_NEW_PHRASES_SUCCESS:
            const newPhrases = action.payload
            return {
                ...state,
                loading: false,
                phrases: newPhrases,
                phrase: nextPhrase(newPhrases, 0),
                scores: [],
                selected: []
            }
        case GET_NEW_PHRASES_FAILURE:
            return {
                ...state,
                ...errorHandler(action.error),
                loading: false
            }
        default:
            return state
    }
}

