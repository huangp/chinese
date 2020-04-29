import React from "reactn"
import {Score} from "../app";
export interface CharacterScoreProps {
    score: Score
}
export const CharacterScore = (props: CharacterScoreProps) => {
    const {character, correct, incorrect, firstSeen} = props.score
    return (
        /*<div className="card">
            <div className="card-body">
                <h5 className="card-title">{character}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{firstSeen}</h6>
                <p className="card-text">
                    Number of correct answer: <span className="m-1 badge badge-pill badge-success">{correctCount}</span>
                    Number of incorrect answer: <span className="m-1 badge badge-pill badge-danger">{incorrectCount}</span>
                </p>
            </div>
        </div>*/
        <div className="card">
            <div className="card-body">
                <span className="h3 border border-primary text-center p-1 mr-1">{character}</span>
                <span className="text-muted">{firstSeen}</span>
                    Number of correct answer: <span className="m-1 badge badge-pill badge-success">{correct}</span>
                    Number of incorrect answer: <span className="m-1 badge badge-pill badge-danger">{incorrect}</span>
            </div>
        </div>
    )
}