import React, {useGlobal} from "reactn"
import {Score} from "../app";
import {getTotalScore} from "../utils";

export const ScoreBadge = () => {
    const [scores] = useGlobal('scores')
    const totalScore = getTotalScore(scores)

    const totalCharacters = scores.length

    return (
        <span>
            <span className="m-1 badge badge-pill badge-success">{totalScore.correct}</span>
            <span className="m-1 badge badge-pill badge-danger">{totalScore.incorrect}</span>
            <span className="float-right badge badge-pill badge-secondary">Total characters: {totalCharacters}</span>
        </span>
    )

}