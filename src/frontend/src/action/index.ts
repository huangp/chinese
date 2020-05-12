import {
    GET_NEW_PHRASES_FAILURE,
    GET_NEW_PHRASES_REQUEST, GET_NEW_PHRASES_SUCCESS,
    MARK_SCORE,
    MarkScoreAction,
    NEXT_PHRASE,
    NextPhraseAction,
    RecognizeState,
    SELECT_CHARACTER,
    SelectCharacterAction,
    SWITCH_USER,
    SwitchUSerAction
} from "./types";
import {User} from "../app";
import {getNextSetOfPhrases} from "../clientserver/phraseClient";


export const toggleSelectCharacter = (char: string): SelectCharacterAction => {
    return {
        type: SELECT_CHARACTER,
        payload: {
            character: char
        }
    }
}

export const switchUserAction = (user: User): SwitchUSerAction => ({
    type: SWITCH_USER,
    payload: {
        user
    }
})

export const markScoresAction = (state: RecognizeState) : MarkScoreAction => ({
    type: MARK_SCORE,
    payload: {
        state
    }
})

export const nextPhraseAction = (): NextPhraseAction => ({
    type: NEXT_PHRASE
})

export const getNewPhrasesAction = (): (dispatch) => any => {
    return async dispatch => {
        dispatch({type: GET_NEW_PHRASES_REQUEST})
        try {
            const phrases: string[] = await getNextSetOfPhrases()
            dispatch({type: GET_NEW_PHRASES_SUCCESS, payload: phrases})
        } catch (e) {
            dispatch({type: GET_NEW_PHRASES_FAILURE, error: e})
        }
    }
}