import React from "reactn"
import {Score} from "../app";
export interface CharacterScoreProps {
    score: Score
}
export const CharacterScore = (props: CharacterScoreProps) => {
    const {character, correct, incorrect, firstSeen} = props.score
    return (
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