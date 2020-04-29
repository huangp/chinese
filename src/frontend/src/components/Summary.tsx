import React from "reactn"
import {Score} from "../app"
import {getTotalScore} from "../utils";
import {CharacterScore} from "./CharacterScore";

export interface SummaryProps {
    scores: Score[]
}

export const Summary = (props: SummaryProps) => {
    const scores = props.scores
    const totalScore = getTotalScore(scores)
    const correctChars = scores.filter(s => s.correct > 0).map(s => s.character)
    const incorrectChars = scores.filter(s => s.incorrect > 0).map(s => s.character)

    const charsSummary = scores.map((s, i) => <li className="list-group-item" key={i}><CharacterScore score={s} /></li>)
    return (
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Number of characters: {scores.length}</li>
            <li className="list-group-item text-success">Total {totalScore.correct} correct answers: {correctChars}</li>
            <li className="list-group-item text-danger">Total {totalScore.correct} incorrect answers: {incorrectChars}</li>
            {charsSummary}
        </ul>
    )
}