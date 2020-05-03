import React from "reactn"
import {PureComponent} from "react"
import {CharacterScore} from "./CharacterScore";
import {getUserScoresForAllFamiliarCharacters} from "../clientserver/scoreClient";
import {Score} from "../app";
import {getAllCharacters} from "../clientserver/phraseClient";
import {User} from "../clientserver/userClient";

interface StateShape {
    scores: Score[];
    allCharacters: string[];
}

export interface ScoreBoardProps {
    user?: User
}


export class ScoreBoard extends PureComponent<ScoreBoardProps, StateShape> {
    constructor(props: ScoreBoardProps) {
        super(props)
        this.state = {scores: [], allCharacters: []}
    }

    componentDidMount() {
        let user = this.props.user
        if (user) {
            Promise.all([getUserScoresForAllFamiliarCharacters(user.username), getAllCharacters()])
                .then(values => {
                    const [scores, allCharacters] = values
                    this.setState({scores, allCharacters})
                })
        }
    }

    render() {
        const user = this.props.user
        const {scores, allCharacters} = this.state
        const allCharCount = allCharacters.length
        const percentNum = allCharCount !== 0 ? Math.round(scores.length / allCharCount * 100) : 0
        const percent = `${percentNum}%`

        const leadingText = user ? `${user.name} knows ${scores.length} out of ${allCharCount}: ${percent}` : 'Need to select a user first!'

        const charsSummary = scores.map((s, i) => <li className="list-group-item" key={i}><CharacterScore score={s} /></li>)
        return (
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div>{leadingText}</div>
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
