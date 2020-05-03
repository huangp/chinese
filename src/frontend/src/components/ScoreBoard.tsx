import React from "reactn"
import {PureComponent} from "react"
import {CharacterScore} from "./CharacterScore";
import {getUserScoresForAllFamiliarCharacters} from "../clientserver/scoreClient";
import {Score} from "../app";
import {getAllCharacters} from "../clientserver/phraseClient";

interface StateShape {
    scores: Score[];
    allCharacters: string[];
}

export interface ScoreBoardProps {
    username: string
}


export class ScoreBoard extends PureComponent<ScoreBoardProps, StateShape> {
    constructor(props: ScoreBoardProps) {
        super(props)
        this.state = {scores: [], allCharacters: []}
    }

    componentDidMount() {
        let username = this.props.username
        if (username) {
            Promise.all([getUserScoresForAllFamiliarCharacters(username), getAllCharacters()])
                .then(values => {
                    const [scores, allCharacters] = values
                    this.setState({scores, allCharacters})
                })
        }
    }

    render() {
        const {scores, allCharacters} = this.state
        const allCharCount = allCharacters.length
        const percentNum = allCharCount !== 0 ? Math.round(scores.length / allCharCount * 100) : 0
        const percent = `${percentNum}%`

        const charsSummary = scores.map((s, i) => <li className="list-group-item" key={i}><CharacterScore score={s} /></li>)
        return (
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div>Knows {scores.length} out of {allCharCount}: {percent}</div>
                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{width: percent}} aria-valuenow={percentNum}
                             aria-valuemin={0} aria-valuemax={allCharCount}>{percent}
                        </div>
                    </div>
                </li>
                {charsSummary}
            </ul>
        )
    }


}
