import React, {setGlobal, useDispatch, useGlobal} from "reactn"
import {Score} from "../app";
import {State} from "reactn/default";
import {nextPhrase} from "../clientserver/phraseService"

enum RecognizeState {
    selectedCorrect, allCorrect, allWrong
}

const updateCount = (correct: boolean, currentScore: Score) => {
    if (correct) {
        currentScore.correct++
    } else {
        currentScore.incorrect++
    }
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
const updateScore = (global: State, dispatch, action: RecognizeState) => {
    const {scores, selected, phrase} = global
    const allChars: string[] = Array.from(phrase)

    console.debug("selected characters", selected)

    if (action == RecognizeState.allCorrect || action == RecognizeState.allWrong) {
        const correctness = action == RecognizeState.allCorrect
        allChars.forEach(c => {
            const score = ensureCurrentScore(scores, c)
            updateCount(correctness, score)
        })
    } else {
        const wrongChars = allChars.filter(c => selected.indexOf(c) < 0)
        selected.forEach(c => {
            const score = ensureCurrentScore(scores, c)
            updateCount(true, score)
        })
        wrongChars.forEach(c => {
            const score = ensureCurrentScore(scores, c)
            updateCount(false, score)
        })
    }
    return {scores}
}

const getNextPhrase = (global:State, dispatch) => {
    const {phrases, selected} = global
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

    const getNewPhraseCallback = e =>
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
                <button type="button" className="btn btn-secondary btn-block" onClick={getNewPhraseCallback}>Get new phrase</button>
            </div>
        </div>
    )
}
