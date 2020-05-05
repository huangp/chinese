import React, {setGlobal, useDispatch, useGlobal} from "reactn"
import {Score} from "../app";
import {State} from "reactn/default";
import {nextPhrase} from "../clientserver/phraseService"
import {saveUserScore} from "../clientserver/scoreClient";

enum RecognizeState {
    selectedCorrect, allCorrect, allWrong
}

const updateCount = (correct: boolean, currentScore: Score): Score => {
    if (correct) {
        currentScore.correct++
    } else {
        currentScore.incorrect++
    }
    return currentScore
}

const ensureCurrentScore = (scores: Score[], character: string): Score => {
    let current = scores.findIndex(v => v.character === character)
    let currentScore
    if (current >= 0) {
        currentScore = scores[current]
    } else {
        currentScore = {character, correct: 0, incorrect: 0}
        scores.push(currentScore)
    }
    return currentScore
}

// reducer to change score
const updateScore = async (global: State, dispatch, action: RecognizeState) => {
    const {scores, selected, phrase, user} = global
    const allChars: string[] = Array.from(phrase)

    console.debug("selected characters", selected)

    let scoresToSave: Score[]
    if (action == RecognizeState.allCorrect || action == RecognizeState.allWrong) {
        const correctness = action == RecognizeState.allCorrect
        scoresToSave = allChars.map(c => {
            const score = ensureCurrentScore(scores, c)
            return updateCount(correctness, score)
        })
    } else {
        const wrongChars = allChars.filter(c => selected.indexOf(c) < 0)
        let correctScores = selected.map(c => {
            const score = ensureCurrentScore(scores, c)
            return updateCount(true, score)
        })
        let incorrectScores = wrongChars.map(c => {
            const score = ensureCurrentScore(scores, c)
            return updateCount(false, score)
        })
        scoresToSave = [...correctScores, ...incorrectScores]
    }
    try {
        await saveUserScore(user.username, scoresToSave, [phrase])
        return {scores}
    } catch (e) {
        return {error: e, scores}
    }
}

const getNextPhrase = (global:State, dispatch) => {
    const {phrases} = global
    const next = nextPhrase(phrases)
    return {
        selected: [],
        phrase: next
    }
}

export const ScoreRecorder = () => {
    const [phrases] = useGlobal("phrases")

    const updateScoreReducer = useDispatch(updateScore)
    const getNextPhraseReducer = useDispatch(getNextPhrase)

    const selectedCorrect = e => updateScoreReducer(RecognizeState.selectedCorrect).then(getNextPhraseReducer)
    const allCorrect = e => updateScoreReducer(RecognizeState.allCorrect).then(getNextPhraseReducer)
    const allWrong = e => updateScoreReducer(RecognizeState.allWrong).then(getNextPhraseReducer)

    const nextPhraseCallback = e =>
        setGlobal({phrase: nextPhrase(phrases), selected: []})

    return (
        <div className="row">
            <div className="col-sm">
                <button type="button" className="btn btn-info btn-block" onClick={selectedCorrect}>Mark selected correct</button>
            </div>
            <div className="col-sm">
                <button type="button" className="btn btn-success btn-block" onClick={allCorrect}>All correct</button>
            </div>
            <div className="col-sm">
                <button type="button" className="btn btn-danger btn-block" onClick={allWrong}>All wrong</button>
            </div>
            <div className="col-sm">
                <button type="button" className="btn btn-secondary btn-block" onClick={nextPhraseCallback}>Next phrase</button>
            </div>
        </div>
    )
}
