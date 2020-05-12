import {Score, User} from "../app";

export const SELECT_CHARACTER = 'SELECT_CHARACTER'
export const MARK_SCORE = 'MARK_SCORE'
export const NEXT_PHRASE = 'NEXT_PHRASE'
export const SWITCH_USER = 'SWITCH_USER'


// get phrases
export const GET_NEW_PHRASES_REQUEST = "GET_NEW_PHRASES_REQUEST"
export const GET_NEW_PHRASES_SUCCESS = "GET_NEW_PHRASES_SUCCESS"
export const GET_NEW_PHRASES_FAILURE = "GET_NEW_PHRASES_FAILURE"



export interface SelectCharacterAction {
    type: typeof SELECT_CHARACTER
    payload: {
        character: string
    }
}

export enum RecognizeState {
    selectedCorrect, allCorrect, allWrong
}

export interface MarkScoreAction {
    type: typeof MARK_SCORE
    payload: {
        state: RecognizeState,
        scoresForPhrase?: Score[]
    }
}

export interface NextPhraseAction {
    type: typeof NEXT_PHRASE
}

export interface SwitchUSerAction {
    type: typeof SWITCH_USER,
    payload: {
        user: User
    }
}

export interface NewPhrasesAction {
    type: typeof GET_NEW_PHRASES_REQUEST | typeof GET_NEW_PHRASES_SUCCESS | typeof GET_NEW_PHRASES_FAILURE
    payload? : string[],
    error? : Error
}



export type ActionTypes = SelectCharacterAction | MarkScoreAction | NextPhraseAction | SwitchUSerAction
    | NewPhrasesAction