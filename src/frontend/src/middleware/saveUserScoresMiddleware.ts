import {MARK_SCORE, MarkScoreAction, RecognizeState} from "../action/types";
import {saveUserScore} from "../clientserver/scoreClient";
import {Score} from "../app";

export default store => next => async action => {
    if (action.type !== MARK_SCORE) {
        return next(action)
    }
    const {currentUsername, phrase, selected} = store.getState()
    const allChars: string[] = Array.from(phrase)
    let scoresToSave: Score[]
    const markState = action.payload.state
    switch(markState) {
        case RecognizeState.selectedCorrect:
            const wrongChars = allChars.filter(c => selected.indexOf(c) < 0)
            let correctScores = selected.map(c => {
                return {character: c, correct: 1, incorrect: 0}
            })
            let incorrectScores = wrongChars.map(c => {
                return {character: c, correct: 0, incorrect: 1}
            })
            scoresToSave = [...correctScores, ...incorrectScores]
            break;
        case RecognizeState.allCorrect:
            scoresToSave = allChars.map(c => {
                return {character: c, correct: 1, incorrect: 0}
            })
            break;
        case RecognizeState.allWrong:
            scoresToSave = allChars.map(c => {
                return {character: c, correct: 0, incorrect: 1}
            })
            break;

    }

    console.info(`saving scores ${currentUsername}`, scoresToSave)
    const updatedAction: MarkScoreAction = {type: action.type, payload: {state: markState, scoresForPhrase: scoresToSave}}
    try {
        await saveUserScore(currentUsername, scoresToSave, [phrase])
        return next(updatedAction)
    } catch (e) {
        console.error("failed to save", e)
        return next(updatedAction)
    }
}