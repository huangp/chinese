import * as React from "react"
import {Score} from "../app";
export interface CharacterScoreProps {
    score: Score
}
export const CharacterScore = (props: CharacterScoreProps) => {
    const {character, correct, incorrect, firstSeen} = props.score
    let firstSeenDate = ''
    if (firstSeen) {
        if (firstSeen instanceof Date) {
            firstSeenDate = firstSeen.toISOString().split('T')[0]
        } else {
            firstSeenDate = new Date(firstSeen).toISOString().split('T')[0]
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                <span className="h3 border border-primary text-center p-1 mr-1">{character}</span>
                    Number of correct answer: <span className="m-1 badge badge-pill badge-success">{correct}</span>
                    Number of incorrect answer: <span className="m-1 badge badge-pill badge-danger">{incorrect}</span>
                <span className="text-muted pl-1">first seen {firstSeenDate}</span>
            </div>
        </div>
    )
}