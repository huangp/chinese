import React, {useGlobal} from "reactn"
import {Score} from "../app"
import {getTotalScore} from "../utils";
import {Link} from "react-router-dom";

export interface SummaryProps {
    scores: Score[]
}

export const Summary = (props: SummaryProps) => {
    const scores = props.scores
    const totalScore = getTotalScore(scores)
    const correctChars = scores.filter(s => s.correct > 0).map(s => s.character)
    const incorrectChars = scores.filter(s => s.incorrect > 0).map(s => s.character)

    return (
        <ul className="list-group list-group-flush">
            <li className="list-group-item">Number of characters: {scores.length}</li>
            <li className="list-group-item text-success">Total {totalScore.correct} correct answers: {correctChars}</li>
            <li className="list-group-item text-danger">Total {totalScore.correct} incorrect answers: {incorrectChars}</li>
            <li className="list-group-item text-info">
                {<Link className="m-2 my-sm-0 float-right" to={`/scoreboard`}>View Score Board</Link>}
            </li>
        </ul>
    )
}