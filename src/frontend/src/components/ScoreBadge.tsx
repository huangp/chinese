import * as React from "react"
import {getTotalScore} from "../utils";
import {connect} from "react-redux"
import {Score} from "../app";

interface ScoreBadgeProps {
    scores: Score[]
}

const ScoreBadge = (props: ScoreBadgeProps) => {
    const scores = props.scores
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

const mapStateToProps = state => ({
    scores: state.scores
})

export default connect(mapStateToProps)(ScoreBadge)