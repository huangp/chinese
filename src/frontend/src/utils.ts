import {Score} from "./app";

export const errorHandler = (err: Error | string): {error:string} => {
    console.error(err)
    if (err instanceof Error) {
        return {error: err.message}
    } else {
        return {error: err}
    }
}

export const getTotalScore = (scores: Score[]): Score => {
    return scores.reduce((prev, curr): Score => {
        return {
            correct: curr.correct + prev.correct,
            incorrect: curr.incorrect + prev.incorrect,
            character: ""
        }
    }, {correct: 0, incorrect: 0, character: ""})
}