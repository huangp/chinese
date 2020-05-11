import {createAction} from "redux-api-middleware"
import {
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